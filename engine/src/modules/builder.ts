import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { EngineConfig } from '../config.js';
import type { BuildArtifact, BuildResult } from '../types.js';

function assertPathInside(basePath: string, targetPath: string): void {
  const normalizedBase = (basePath.endsWith('/') || basePath.endsWith('\\') ? basePath : `${basePath}/`).replace(/\\/g, '/');
  const normalizedTarget = targetPath.replace(/\\/g, '/');
  if (!normalizedTarget.startsWith(normalizedBase)) {
    throw new Error(`Unsafe output path detected: ${targetPath}`);
  }
}

export class Builder {
  constructor(private readonly config: EngineConfig) {}

  async materialize(artifact: BuildArtifact): Promise<BuildResult> {
    await rm(this.config.outputDir, { recursive: true, force: true });
    await mkdir(this.config.outputDir, { recursive: true });

    let filesWritten = 0;

    for (const file of artifact.files) {
      const outputPath = resolve(this.config.outputDir, file.path);
      assertPathInside(this.config.outputDir, outputPath);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, file.content, 'utf8');
      filesWritten += 1;
    }

    return { outputDir: this.config.outputDir, filesWritten };
  }
}
