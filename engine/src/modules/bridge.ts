import type { IncomingMessage, ServerResponse } from 'node:http';
import type { BridgeLogEvent, EngineState } from '../types.js';

interface BridgePacket<T> {
  event: string;
  data: T;
}

export class Bridge {
  private readonly clients = new Set<ServerResponse<IncomingMessage>>();
  private heartbeat: NodeJS.Timeout | null = null;

  handleSseConnection(_req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });
    res.write(': connected\n\n');
    this.clients.add(res);

    res.on('close', () => {
      this.clients.delete(res);
    });

    if (!this.heartbeat) {
      this.heartbeat = setInterval(() => {
        this.broadcastRaw(': ping\n\n');
      }, 15_000);
    }
  }

  broadcastLog(log: BridgeLogEvent): void {
    this.broadcast({ event: 'engine-log', data: log });
  }

  broadcastState(state: EngineState): void {
    this.broadcast({ event: 'engine-state', data: state });
  }

  broadcastLifecycle(event: string, payload: unknown): void {
    this.broadcast({ event, data: payload });
  }

  close(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
    for (const client of this.clients) {
      client.end();
    }
    this.clients.clear();
  }

  private broadcast<T>(packet: BridgePacket<T>): void {
    const serialized = `event: ${packet.event}\ndata: ${JSON.stringify(packet.data)}\n\n`;
    this.broadcastRaw(serialized);
  }

  private broadcastRaw(payload: string): void {
    for (const client of this.clients) {
      if (!client.writableEnded) {
        client.write(payload);
      }
    }
  }
}
