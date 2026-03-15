import type { EngineConfig } from '../config.js';
import type { EngineEventBus } from '../core/event-bus.js';
import type { SeedstrClient } from '../providers/seedstr-client.js';
import { createLog } from '../utils/logger.js';

function nextDelay(minMs: number, maxMs: number): number {
  return Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
}

export class Watcher {
  private running = false;
  private timer: NodeJS.Timeout | null = null;
  private readonly processedJobs: Set<string> = new Set();

  constructor(
    private readonly config: EngineConfig,
    private readonly client: SeedstrClient,
    private readonly bus: EngineEventBus,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.schedule(100);
    this.bus.emit('log', createLog('Watcher', 'success', 'Watcher started. Polling Seedstr API.'));
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.bus.emit('log', createLog('Watcher', 'info', 'Watcher stopped.'));
  }

  isRunning(): boolean {
    return this.running;
  }

  /** Mark a job as processed so it won't be picked up again. */
  markProcessed(jobId: string): void {
    this.processedJobs.add(jobId);

    // Cap at 1000 entries to prevent memory leaks
    if (this.processedJobs.size > 1000) {
      const entries = Array.from(this.processedJobs);
      const trimmed = entries.slice(-1000);
      this.processedJobs.clear();
      for (const id of trimmed) this.processedJobs.add(id);
    }
  }

  private schedule(delayMs: number): void {
    this.timer = setTimeout(() => {
      void this.tick();
    }, delayMs);
  }

  private async tick(): Promise<void> {
    if (!this.running) return;

    const checkedAt = new Date().toISOString();
    try {
      const result = await this.client.pollJobs();
      const nextDelayMs = nextDelay(this.config.pollMinMs, this.config.pollMaxMs);

      this.bus.emit('tick', { checkedAt, nextDelayMs });

      if (result.ready && result.prompt && result.jobId) {
        // Skip if already processed
        if (this.processedJobs.has(result.jobId)) {
          this.bus.emit('prompt_waiting', {
            ready: false,
            reason: `Job ${result.jobId} already processed. Skipping.`,
            raw: result.raw,
          });
        } else {
          this.bus.emit('prompt_ready', {
            prompt: result.prompt,
            jobId: result.jobId,
            jobType: result.jobType,
            raw: result.raw,
          });
        }
      } else {
        this.bus.emit('prompt_waiting', result);
      }

      this.schedule(nextDelayMs);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.bus.emit('error', { stage: 'watching', error: err });

      const retryMs = nextDelay(this.config.pollMinMs, this.config.pollMaxMs);
      this.schedule(retryMs);
    }
  }
}
