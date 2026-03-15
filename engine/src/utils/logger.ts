import { randomUUID } from 'node:crypto';
import type { BridgeLogEvent, LogLevel } from '../types.js';

export function createLog(source: string, level: LogLevel, message: string, meta?: unknown): BridgeLogEvent {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    meta,
  };
}
