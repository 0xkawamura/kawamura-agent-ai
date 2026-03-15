import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { EngineConfig } from '../config.js';
import type { PollResult, SubmissionResult } from '../types.js';

interface Job {
  id: string;
  prompt?: string;
  description?: string;
  text?: string;
  budget: number;
  budgetPerAgent?: number;
  status: string;
  jobType?: string;
  createdAt: string;
  [key: string]: unknown;
}

interface JobsListResponse {
  jobs?: Job[];
  data?: Job[];
  total?: number;
}

interface FileUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface FileAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

const MIME_TYPES: Record<string, string> = {
  zip: 'application/zip',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  md: 'text/markdown',
  txt: 'text/plain',
  png: 'image/png',
  jpg: 'image/jpeg',
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function deepFindPrompt(payload: unknown): string | undefined {
  if (typeof payload === 'string') return undefined;
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = deepFindPrompt(item);
      if (found) return found;
    }
    return undefined;
  }
  if (!isObject(payload)) return undefined;

  const candidateKeys = ['prompt', 'mysteryPrompt', 'challengePrompt', 'text', 'description'];
  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim().length > 10) {
      return value.trim();
    }
  }

  for (const value of Object.values(payload)) {
    const found = deepFindPrompt(value);
    if (found) return found;
  }
  return undefined;
}

export class SeedstrClient {
  constructor(private readonly config: EngineConfig) {}

  async pollJobs(): Promise<PollResult> {
    const payload = await this.request<JobsListResponse>(
      `${this.config.seedstrApiUrl}/jobs?limit=20&offset=0`,
      { method: 'GET' },
    );

    const jobs = payload.jobs ?? payload.data ?? [];

    for (const job of jobs) {
      if (job.status === 'completed' || job.status === 'cancelled') continue;

      const effectiveBudget = job.budgetPerAgent ?? job.budget ?? 0;
      if (effectiveBudget < this.config.minBudget && this.config.minBudget > 0) continue;

      const prompt = deepFindPrompt(job);
      if (prompt) {
        return {
          ready: true,
          prompt,
          jobId: job.id,
          reason: `Job ${job.id} has a prompt (budget: $${effectiveBudget}).`,
          raw: { jobId: job.id, job },
        };
      }
    }

    return {
      ready: false,
      reason: `No actionable jobs found. ${jobs.length} jobs checked.`,
      raw: payload,
    };
  }

  async uploadFile(filePath: string): Promise<FileAttachment> {
    const fileName = basename(filePath);
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream';

    const fileBuffer = readFileSync(filePath);
    const base64Content = fileBuffer.toString('base64');

    const result = await this.request<{ success: boolean; files: FileUploadResult[] }>(
      `${this.config.seedstrUploadUrl}/upload`,
      {
        method: 'POST',
        body: JSON.stringify({
          files: [{ name: fileName, content: base64Content, type: mimeType }],
        }),
      },
    );

    if (!result.success || !result.files?.length) {
      throw new Error('File upload failed: no files returned from Seedstr.');
    }

    return result.files[0];
  }

  async submitResponse(jobId: string, content: string, files?: FileAttachment[]): Promise<SubmissionResult> {
    const body: Record<string, unknown> = {
      content,
      responseType: files?.length ? 'FILE' : 'TEXT',
    };
    if (files?.length) {
      body.files = files;
    }

    const result = await this.request<Record<string, unknown>>(
      `${this.config.seedstrApiUrl}/jobs/${jobId}/respond`,
      { method: 'POST', body: JSON.stringify(body) },
    );

    return {
      submissionId: (result.responseId ?? result.submissionId) as string | undefined,
      jobId,
      raw: result,
    };
  }

  async submitArchive(zipPath: string, jobId?: string): Promise<SubmissionResult> {
    const fileAttachment = await this.uploadFile(zipPath);

    if (jobId) {
      return this.submitResponse(
        jobId,
        `Kawamura Agent automated submission. Archive: ${fileAttachment.name} (${fileAttachment.size} bytes)`,
        [fileAttachment],
      );
    }

    return { submissionId: undefined, raw: { uploaded: true, file: fileAttachment } };
  }

  async submitTextOnly(jobId: string, content: string): Promise<SubmissionResult> {
    return this.submitResponse(jobId, content);
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (this.config.seedstrApiKey) {
        headers.Authorization = `Bearer ${this.config.seedstrApiKey}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
        signal: controller.signal,
      });

      const text = await response.text();
      const parsed = text ? (JSON.parse(text) as T) : ({} as T);

      if (!response.ok) {
        throw new Error(`Seedstr API error (${response.status}): ${text.slice(0, 400)}`);
      }

      return parsed;
    } finally {
      clearTimeout(timeout);
    }
  }
}
