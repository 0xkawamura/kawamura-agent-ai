import { EventEmitter } from 'node:events';
import type { EngineEventMap } from '../types.js';

export class EngineEventBus {
  private readonly emitter = new EventEmitter();

  emit<K extends keyof EngineEventMap>(eventName: K, payload: EngineEventMap[K]): void {
    this.emitter.emit(eventName, payload);
  }

  on<K extends keyof EngineEventMap>(eventName: K, handler: (payload: EngineEventMap[K]) => void): () => void {
    const wrapped = (payload: EngineEventMap[K]) => handler(payload);
    this.emitter.on(eventName, wrapped);
    return () => {
      this.emitter.off(eventName, wrapped);
    };
  }
}
