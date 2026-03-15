import type { EngineConfig } from '../config.js';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

export class OpenRouterClient {
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private readonly config: EngineConfig) {}

  async complete(
    messages: OpenRouterMessage[],
    model?: string,
    maxTokens?: number,
    temperature?: number,
  ): Promise<string> {
    if (!this.config.openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not set.');
    }

    const usedModel = model ?? this.config.openrouterModel;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://kawamura-agent.vercel.app',
          'X-Title': 'Kawamura Agent',
        },
        body: JSON.stringify({
          model: usedModel,
          messages,
          max_tokens: maxTokens ?? this.config.llmMaxTokens,
          temperature: temperature ?? this.config.llmTemperature,
        }),
        signal: controller.signal,
      });

      const payload = (await response.json()) as OpenRouterResponse;

      if (!response.ok) {
        throw new Error(`OpenRouter error (${response.status}): ${payload.error?.message ?? JSON.stringify(payload).slice(0, 300)}`);
      }

      const text = payload.choices?.[0]?.message?.content;
      if (!text || text.trim().length === 0) {
        throw new Error(`OpenRouter (${usedModel}) returned empty response.`);
      }

      return text;
    } finally {
      clearTimeout(timeout);
    }
  }

  async completeWithFallback(messages: OpenRouterMessage[], maxTokens?: number, temperature?: number): Promise<string> {
    const models = [this.config.openrouterModel, this.config.openrouterFallbackModel];
    const errors: string[] = [];

    for (const model of models) {
      try {
        const result = await this.complete(messages, model, maxTokens, temperature);
        if (errors.length > 0) {
          console.log(`[OpenRouter] Switched to ${model} after ${errors.length} failure(s).`);
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${model}: ${msg}`);
        console.log(`[OpenRouter] ${model} failed: ${msg.slice(0, 200)}`);
      }
    }

    throw new Error(`All models failed: ${errors.join(' | ')}`);
  }
}
