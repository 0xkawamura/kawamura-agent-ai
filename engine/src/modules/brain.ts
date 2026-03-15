import type { EngineConfig } from '../config.js';
import { HACKATHON_SYSTEM_PROMPT } from '../config.js';
import type { OpenRouterClient } from '../providers/openrouter-client.js';
import { PromptClassifier } from '../tools/promptClassifier.js';
import { generateFromTemplate } from '../tools/templateLibrary.js';
import { validateFiles } from '../tools/validator.js';
import type { BuildArtifact, BuildArtifactFile, ClassificationResult, GenerationResult } from '../types.js';

/* ── Response-type detection ──────────────────────────────── */

const FILE_KEYWORDS = [
  'build', 'create', 'make', 'generate', 'develop', 'design',
  'website', 'web app', 'webapp', 'landing page', 'portfolio',
  'dashboard', 'app', 'application', 'page', 'site', 'html',
  'frontend', 'front-end', 'ui', 'interface', 'template',
  'ecommerce', 'e-commerce', 'shop', 'store', 'blog',
  'game', 'quiz', 'form', 'calculator', 'tool',
];

const TEXT_KEYWORDS = [
  'write', 'explain', 'describe', 'analyze', 'list',
  'summarize', 'tell me', 'what is', 'how to', 'advice',
  'strategy', 'plan', 'review', 'compare', 'tweet',
  'email', 'letter', 'essay', 'article', 'report',
  'opinion', 'suggestion', 'recommend',
];

function detectResponseType(prompt: string): 'TEXT' | 'FILE' {
  const lower = prompt.toLowerCase();
  let fileScore = 0;
  let textScore = 0;

  for (const kw of FILE_KEYWORDS) {
    if (lower.includes(kw)) fileScore++;
  }
  for (const kw of TEXT_KEYWORDS) {
    if (lower.includes(kw)) textScore++;
  }

  // Default to FILE for the hackathon — the prompt is most likely asking for a project
  return textScore > fileScore && fileScore === 0 ? 'TEXT' : 'FILE';
}

function sanitizeFences(raw: string): string {
  return raw.trim()
    .replace(/^```(?:json|js|ts|tsx|javascript|typescript)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim();
}

function repairJson(raw: string): string {
  const result: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) { result.push(ch); escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; result.push(ch); continue; }
    if (ch === '"') { inString = !inString; result.push(ch); continue; }
    if (inString) {
      if (ch === '\n') { result.push('\\n'); continue; }
      if (ch === '\r') { result.push('\\r'); continue; }
      if (ch === '\t') { result.push('\\t'); continue; }
    }
    result.push(ch);
  }
  return result.join('');
}

function parseArtifact(text: string): BuildArtifact {
  const clean = sanitizeFences(text);

  const tryParse = (candidate: string): BuildArtifact | null => {
    for (const attempt of [candidate, repairJson(candidate)]) {
      try {
        const parsed = JSON.parse(attempt) as Record<string, unknown>;
        if (typeof parsed !== 'object' || parsed === null) continue;

        const projectName = typeof parsed.projectName === 'string' ? parsed.projectName : 'kawamura-generated';
        const rawFiles = Array.isArray(parsed.files) ? parsed.files : [];
        const files: BuildArtifactFile[] = rawFiles
          .map((f: unknown) => {
            if (typeof f !== 'object' || f === null) return null;
            const file = f as Record<string, unknown>;
            if (typeof file.path !== 'string' || typeof file.content !== 'string') return null;
            return { path: file.path, content: file.content };
          })
          .filter((f): f is BuildArtifactFile => f !== null);

        if (files.length === 0) continue;
        return { projectName, files };
      } catch {
        // try next
      }
    }
    return null;
  };

  const direct = tryParse(clean);
  if (direct) return direct;

  const blockMatch = clean.match(/\{[\s\S]*\}/);
  if (blockMatch) {
    const fromBlock = tryParse(blockMatch[0]);
    if (fromBlock) return fromBlock;
  }

  throw new Error('Unable to parse LLM response as valid artifact JSON.');
}

export class Brain {
  private readonly classifier: PromptClassifier;

  constructor(
    private readonly config: EngineConfig,
    private readonly llm: OpenRouterClient,
  ) {
    this.classifier = new PromptClassifier(llm);
  }

  async generateFromPrompt(prompt: string): Promise<GenerationResult> {
    // Step 1: Detect whether the prompt asks for code/project (FILE) or text (TEXT)
    const responseType = detectResponseType(prompt);
    console.log(`[Brain] Response type detected: ${responseType}`);

    if (responseType === 'TEXT') {
      console.log('[Brain] Prompt asks for text — generating text-only response.');
      const textContent = await this.generateTextResponse(prompt);
      return { responseType: 'TEXT', textContent };
    }

    // Step 2: FILE path — classify and generate
    const classification = await this.classifier.classifyPrompt(prompt);
    console.log(`[Brain] Classified as "${classification.templateSlug}" (confidence: ${classification.confidence.toFixed(2)})`);

    // If classifier returns 'none' or very low confidence, use full LLM
    if (classification.templateSlug === 'none' || classification.confidence < 0.5) {
      console.log('[Brain] No template match — using full LLM generation.');
      const artifact = await this.fullGenerate(prompt);
      return { responseType: 'FILE', artifact };
    }

    try {
      const artifact = await this.templateFastPath(prompt, classification);
      return { responseType: 'FILE', artifact };
    } catch (err) {
      console.warn(`[Brain] Template fast-path failed (${(err as Error).message}) — falling back to full LLM.`);
      const artifact = await this.fullGenerate(prompt);
      return { responseType: 'FILE', artifact };
    }
  }

  private async generateTextResponse(prompt: string): Promise<string> {
    const textSystemPrompt = [
      'You are Kawamura Agent — a world-class AI assistant.',
      'Respond to the following prompt with a thorough, well-structured, and professional text response.',
      'Be helpful, accurate, concise, and insightful.',
      'Use markdown formatting for readability.',
      'Do NOT generate code files or JSON — just respond with natural text.',
    ].join('\n');

    return this.llm.completeWithFallback(
      [
        { role: 'system', content: textSystemPrompt },
        { role: 'user', content: prompt },
      ],
      this.config.llmMaxTokens,
      this.config.llmTemperature,
    );
  }

  private async templateFastPath(
    _prompt: string,
    classification: ClassificationResult,
  ): Promise<BuildArtifact & { classification: ClassificationResult }> {
    const files = generateFromTemplate(classification.templateSlug, classification.slots, classification.accentColor);

    const validation = validateFiles(files);
    if (!validation.valid) {
      console.warn(`[Brain] Template validation warnings: ${validation.issues.join('; ')}`);
    }

    return {
      projectName: `kawamura-${classification.templateSlug}-${Date.now()}`,
      files,
      notes: [`Template fast-path: ${classification.templateSlug} (confidence: ${classification.confidence.toFixed(2)})`],
      classification,
    };
  }

  private async fullGenerate(prompt: string): Promise<BuildArtifact> {
    const rawText = await this.llm.completeWithFallback(
      [
        { role: 'system', content: HACKATHON_SYSTEM_PROMPT },
        { role: 'user', content: `Mystery prompt: ${prompt}` },
      ],
      this.config.llmMaxTokens,
      this.config.llmTemperature,
    );

    const artifact = parseArtifact(rawText);

    // Retry once if validation fails
    const validation = validateFiles(artifact.files);
    if (!validation.valid) {
      console.warn(`[Brain] Validation issues: ${validation.issues.join('; ')} — retrying with fixes.`);
      const retryText = await this.llm.completeWithFallback(
        [
          { role: 'system', content: HACKATHON_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Mystery prompt: ${prompt}\n\nPrevious output had issues: ${validation.issues.join('; ')}. Please fix and regenerate.`,
          },
        ],
        this.config.llmMaxTokens,
        this.config.llmTemperature,
      );
      return parseArtifact(retryText);
    }

    return artifact;
  }
}
