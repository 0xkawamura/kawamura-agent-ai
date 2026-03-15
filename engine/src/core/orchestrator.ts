import type { EngineEventBus } from './event-bus.js';
import type { Brain } from '../modules/brain.js';
import type { Builder } from '../modules/builder.js';
import type { Packer } from '../modules/packer.js';
import type { Watcher } from '../modules/watcher.js';
import type { SeedstrClient } from '../providers/seedstr-client.js';
import type { EngineState, EngineStage } from '../types.js';
import { createLog } from '../utils/logger.js';

export class CoreEngine {
  private readonly state: EngineState = {
    running: false,
    processing: false,
    stage: 'idle',
    jobsProcessed: 0,
  };

  constructor(
    private readonly bus: EngineEventBus,
    private readonly watcher: Watcher,
    private readonly brain: Brain,
    private readonly builder: Builder,
    private readonly packer: Packer,
    private readonly seedstrClient: SeedstrClient,
  ) {
    this.wireEvents();
  }

  getState(): EngineState {
    return { ...this.state };
  }

  start(): EngineState {
    if (this.state.running) return this.getState();
    this.state.running = true;
    this.setStage('watching');
    this.watcher.start();
    this.emitLog('success', 'Kawamura Agent is online.', 'CoreEngine');
    this.emitState();
    return this.getState();
  }

  stop(): EngineState {
    this.state.running = false;
    this.watcher.stop();
    if (!this.state.processing) this.setStage('idle');
    this.emitLog('warn', 'Engine stopped by operator.', 'CoreEngine');
    this.emitState();
    return this.getState();
  }

  injectPrompt(prompt: string, jobId?: string): void {
    this.bus.emit('prompt_ready', { prompt, jobId, raw: { source: 'manual-inject' } });
  }

  private wireEvents(): void {
    this.bus.on('tick', event => {
      this.state.lastTickAt = event.checkedAt;
      this.emitLog('info', `Watcher tick. Next poll in ${(event.nextDelayMs / 1000).toFixed(1)}s.`, 'Watcher');
      this.emitState();
    });

    this.bus.on('prompt_waiting', event => {
      this.emitLog('info', `Idle: ${event.reason}`, 'Watcher');
    });

    this.bus.on('prompt_ready', event => {
      if (!this.state.running) return;
      if (this.state.processing) {
        this.emitLog('warn', 'Prompt received while processing. Queued for next cycle.', 'CoreEngine');
        return;
      }

      this.state.processing = true;
      this.state.lastPromptAt = new Date().toISOString();
      this.state.lastJobId = event.jobId;
      this.setStage('prompt_received');
      this.emitLog('success', `Mystery prompt received! Job: ${event.jobId ?? 'manual'}`, 'Watcher');
      this.emitState();

      void this.executePipeline(event.prompt, event.jobId);
    });

    this.bus.on('error', event => {
      this.state.lastError = `${event.stage}: ${event.error.message}`;
      this.setStage('error');
      this.emitLog('error', event.error.message, event.stage.toUpperCase());
      this.emitState();
    });
  }

  private async executePipeline(prompt: string, jobId?: string): Promise<void> {
    try {
      // Stage: classifying + generating
      this.setStage('classifying');
      this.emitLog('info', 'Stage 1 / Detecting response type & classifying...', 'Brain');
      this.emitState();

      this.setStage('generating');
      this.emitLog('info', 'Stage 2 / Brain generating output...', 'Brain');
      this.emitState();

      const result = await this.brain.generateFromPrompt(prompt);

      // ─── TEXT RESPONSE PATH ───────────────────────────
      if (result.responseType === 'TEXT' && result.textContent) {
        this.emitLog('success', `Brain produced TEXT response (${result.textContent.length} chars).`, 'Brain');

        this.setStage('submitting');
        this.emitLog('info', `Submitting TEXT response${jobId ? ` to job ${jobId}` : ''}...`, 'Packer');
        this.emitState();

        if (jobId) {
          const submissionResult = await this.seedstrClient.submitTextOnly(jobId, result.textContent);
          this.bus.emit('submitted', submissionResult);
          this.state.lastSubmissionId = submissionResult.submissionId;
        } else {
          this.emitLog('warn', 'No jobId — TEXT response generated but not submitted.', 'CoreEngine');
        }

        this.state.lastSubmissionAt = new Date().toISOString();
        this.state.jobsProcessed += 1;
        this.setStage('completed');
        this.emitLog('success', 'TEXT response submitted successfully!', 'CoreEngine');
        return;
      }

      // ─── FILE RESPONSE PATH (existing pipeline) ──────
      if (!result.artifact) {
        throw new Error('Brain returned FILE response but no artifact.');
      }

      const artifact = result.artifact;
      const templateSlug = artifact.classification?.templateSlug;
      if (templateSlug) {
        this.state.lastTemplateSlug = templateSlug;
        this.bus.emit('classified', {
          templateSlug,
          confidence: artifact.classification?.confidence ?? 1,
          slots: artifact.classification?.slots ?? {},
        });
      }
      this.emitLog('success', `Brain produced ${artifact.files.length} files.${templateSlug ? ` Template: ${templateSlug}` : ''}`, 'Brain');

      // Stage: building
      this.setStage('building');
      this.emitLog('info', 'Stage 3 / Builder writing files...', 'Builder');
      this.emitState();

      const buildResult = await this.builder.materialize(artifact);
      this.bus.emit('output_ready', buildResult);
      this.emitLog('success', `Wrote ${buildResult.filesWritten} files to ${buildResult.outputDir}`, 'Builder');

      // Stage: packing
      this.setStage('packing');
      this.emitLog('info', 'Stage 4 / Packer creating archive...', 'Packer');
      this.emitState();

      const zipResult = await this.packer.createZip(buildResult.outputDir);
      this.bus.emit('zipped', zipResult);
      this.emitLog('success', `Archive created: ${(zipResult.bytes / 1024).toFixed(1)} KB`, 'Packer');

      // Stage: submitting
      this.setStage('submitting');
      this.emitLog('info', `Stage 5 / Submitting to Seedstr${jobId ? ` (job: ${jobId})` : ''}...`, 'Packer');
      this.emitState();

      const submissionResult = await this.packer.submit(zipResult.zipPath, jobId);
      this.bus.emit('submitted', submissionResult);
      this.state.lastSubmissionId = submissionResult.submissionId;
      this.state.lastSubmissionAt = new Date().toISOString();
      this.state.jobsProcessed += 1;

      this.setStage('completed');
      this.emitLog('success', `Submitted! ID: ${submissionResult.submissionId ?? 'pending'}`, 'Packer');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.bus.emit('error', { stage: this.state.stage, error: err });
    } finally {
      this.state.processing = false;
      if (this.state.running) this.setStage('watching');
      this.emitState();
    }
  }

  private setStage(stage: EngineStage): void {
    this.state.stage = stage;
  }

  private emitState(): void {
    this.bus.emit('state', { ...this.state });
  }

  private emitLog(level: 'info' | 'warn' | 'error' | 'success', message: string, source: string): void {
    const log = createLog(source, level, message);
    console.log(`[${source}] [${level.toUpperCase()}] ${message}`);
    this.bus.emit('log', log);
  }
}
