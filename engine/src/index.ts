import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// .env lives in project root (two levels up from engine/dist/)
dotenvConfig({ path: resolve(__dirname, '../../.env') });

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig } from './config.js';
import { EngineEventBus } from './core/event-bus.js';
import { CoreEngine } from './core/orchestrator.js';
import { Bridge } from './modules/bridge.js';
import { Brain } from './modules/brain.js';
import { Builder } from './modules/builder.js';
import { Packer } from './modules/packer.js';
import { Watcher } from './modules/watcher.js';
import { SeedstrClient } from './providers/seedstr-client.js';
import { OpenRouterClient } from './providers/openrouter-client.js';
import { TEMPLATE_SLUGS } from './tools/templateLibrary.js';
import { createLog } from './utils/logger.js';

interface JsonBody {
  [key: string]: unknown;
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown, corsOrigin: string): void {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

async function readBody(req: IncomingMessage): Promise<JsonBody> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as JsonBody;
}

const config = loadConfig();
const bus = new EngineEventBus();
const bridge = new Bridge();
const seedstrClient = new SeedstrClient(config);
const llmClient = new OpenRouterClient(config);
const watcher = new Watcher(config, seedstrClient, bus);
const brain = new Brain(config, llmClient);
const builder = new Builder(config);
const packer = new Packer(config, seedstrClient);
const engine = new CoreEngine(bus, watcher, brain, builder, packer, seedstrClient);

bus.on('log', payload => bridge.broadcastLog(payload));
bus.on('state', payload => bridge.broadcastState(payload));
bus.on('tick', payload => bridge.broadcastLifecycle('watcher-tick', payload));
bus.on('classified', payload => bridge.broadcastLifecycle('job-classified', payload));
bus.on('output_ready', payload => bridge.broadcastLifecycle('build-complete', payload));
bus.on('zipped', payload => bridge.broadcastLifecycle('packer-zipped', payload));
bus.on('submitted', payload => bridge.broadcastLifecycle('submitted', payload));
bus.on('error', payload => bridge.broadcastLifecycle('engine-error', {
  stage: payload.stage,
  message: payload.error.message,
}));

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? `127.0.0.1:${config.serverPort}`}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {}, config.corsOrigin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, agent: 'kawamura-agent', version: '1.0.0' }, config.corsOrigin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/state') {
    sendJson(res, 200, { ...engine.getState(), agentId: config.agentId }, config.corsOrigin);
    return;
  }


  if (req.method === 'GET' && url.pathname === '/jobs') {
    sendJson(res, 200, { jobs: engine.getJobs() }, config.corsOrigin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/templates') {
    sendJson(res, 200, { templates: TEMPLATE_SLUGS }, config.corsOrigin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/events') {
    bridge.handleSseConnection(req, res, config.corsOrigin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/preview') {
    try {
      const { readFile } = await import('node:fs/promises');
      const htmlPath = resolve(config.outputDir, 'index.html');
      const html = await readFile(htmlPath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': config.corsOrigin,
      });
      res.end(html);
    } catch {
      res.writeHead(404, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': config.corsOrigin,
      });
      res.end(JSON.stringify({ error: 'No preview available yet. Generate something first.' }));
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/download') {
    try {
      const { readdir, readFile: rf } = await import('node:fs/promises');
      // Find most recent zip in archiveDir, fall back to outputDir
      let zipPath: string | null = null;
      try {
        const files = await readdir(config.archiveDir);
        const zips = files.filter(f => f.endsWith('.zip')).sort().reverse();
        if (zips.length > 0) zipPath = resolve(config.archiveDir, zips[0]);
      } catch { /* no archives yet */ }

      if (!zipPath) {
        // fallback: look for zip directly in outputDir parent
        const files = await readdir(resolve(config.outputDir, '..'));
        const zips = files.filter(f => f.endsWith('.zip')).sort().reverse();
        if (zips.length > 0) zipPath = resolve(config.outputDir, '..', zips[0]);
      }

      if (!zipPath) throw new Error('No ZIP found.');

      const zipData = await rf(zipPath);
      const filename = zipPath.split('/').pop() ?? 'kawamura-output.zip';
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(zipData.length),
        'Access-Control-Allow-Origin': config.corsOrigin,
      });
      res.end(zipData);
    } catch {
      res.writeHead(404, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': config.corsOrigin,
      });
      res.end(JSON.stringify({ error: 'No ZIP available yet. Generate something first.' }));
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/control/start') {
    sendJson(res, 200, engine.start(), config.corsOrigin);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/control/stop') {
    sendJson(res, 200, engine.stop(), config.corsOrigin);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/control/prompt') {
    try {
      const body = await readBody(req);
      const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
      const jobId = typeof body.jobId === 'string' ? body.jobId.trim() : undefined;

      if (!prompt) {
        sendJson(res, 400, { error: 'prompt is required.' }, config.corsOrigin);
        return;
      }

      engine.injectPrompt(prompt, jobId || undefined);
      sendJson(res, 200, { accepted: true }, config.corsOrigin);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 400, { error: `Invalid JSON: ${message}` }, config.corsOrigin);
      return;
    }
  }

  sendJson(res, 404, { error: 'Not Found' }, config.corsOrigin);
});

server.listen(config.serverPort, () => {
  const log = createLog('CoreEngine', 'success', `Kawamura Agent engine listening on http://127.0.0.1:${config.serverPort}`);
  bridge.broadcastLog(log);
  console.log(`[CoreEngine] ${log.message}`);

  if (config.autoStart) {
    engine.start();
  }
});

const shutdown = (): void => {
  engine.stop();
  bridge.close();
  server.close();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
