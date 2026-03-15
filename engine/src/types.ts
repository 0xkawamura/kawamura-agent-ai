export type EngineStage =
  | 'idle'
  | 'watching'
  | 'prompt_received'
  | 'classifying'
  | 'generating'
  | 'building'
  | 'packing'
  | 'submitting'
  | 'completed'
  | 'error';

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface BridgeLogEvent {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  meta?: unknown;
}

export interface EngineState {
  running: boolean;
  stage: EngineStage;
  processing: boolean;
  lastTickAt?: string;
  lastPromptAt?: string;
  lastJobId?: string;
  lastTemplateSlug?: string;
  lastSubmissionAt?: string;
  lastSubmissionId?: string;
  lastError?: string;
  jobsProcessed: number;
}

export interface PollResult {
  ready: boolean;
  prompt?: string;
  jobId?: string;
  reason: string;
  raw: unknown;
}

export interface ClassificationResult {
  templateSlug: string;
  confidence: number;
  slots: Record<string, string>;
}

export interface BuildArtifactFile {
  path: string;
  content: string;
}

export interface BuildArtifact {
  projectName: string;
  files: BuildArtifactFile[];
  notes?: string[];
}

export type ResponseType = 'TEXT' | 'FILE';

export interface GenerationResult {
  responseType: ResponseType;
  /** Present when responseType is 'FILE' */
  artifact?: BuildArtifact & { classification?: ClassificationResult };
  /** Present when responseType is 'TEXT' */
  textContent?: string;
}

export interface BuildResult {
  outputDir: string;
  filesWritten: number;
}

export interface ZipResult {
  zipPath: string;
  bytes: number;
}

export interface SubmissionResult {
  submissionId?: string;
  jobId?: string;
  raw: unknown;
}

export interface PromptReadyEvent {
  prompt: string;
  jobId?: string;
  raw: unknown;
}

export interface TickEvent {
  checkedAt: string;
  nextDelayMs: number;
}

export interface EngineEventMap {
  log: BridgeLogEvent;
  state: EngineState;
  tick: TickEvent;
  prompt_waiting: PollResult;
  prompt_ready: PromptReadyEvent;
  classified: ClassificationResult;
  output_ready: BuildResult;
  zipped: ZipResult;
  submitted: SubmissionResult;
  error: { stage: EngineStage; error: Error };
}
