import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { zipSync } from 'fflate';
import type { EngineConfig } from '../config.js';
import type { SeedstrClient } from '../providers/seedstr-client.js';
import type { SubmissionResult, ZipResult } from '../types.js';

type ZipInput = Record<string, Uint8Array>;

async function collectFiles(rootDir: string, currentDir: string, zipData: ZipInput): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = resolve(currentDir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(rootDir, absolutePath, zipData);
    } else if (entry.isFile()) {
      const relPath = relative(rootDir, absolutePath).replace(/\\/g, '/');
      zipData[relPath] = await readFile(absolutePath);
    }
  }
}

export class Packer {
  constructor(
    private readonly config: EngineConfig,
    private readonly seedstrClient: SeedstrClient,
  ) {}

  async createZip(sourceDir: string): Promise<ZipResult> {
    await mkdir(this.config.archiveDir, { recursive: true });

    const zipData: ZipInput = {};
    await collectFiles(sourceDir, sourceDir, zipData);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveName = `kawamura-${timestamp}.zip`;
    const zipPath = join(this.config.archiveDir, archiveName);

    const zippedBytes = zipSync(zipData, { level: 9 });
    await writeFile(zipPath, zippedBytes);

    return { zipPath, bytes: zippedBytes.byteLength };
  }

  async submit(zipPath: string, jobId?: string): Promise<SubmissionResult> {
    return this.seedstrClient.submitArchive(zipPath, jobId);
  }
}
