import type { OpenRouterClient } from '../providers/openrouter-client.js';
import type { ClassificationResult } from '../types.js';

interface TemplateKeywords {
  slug: string;
  keywords: string[];
  slots: string[];
}

const TEMPLATES: TemplateKeywords[] = [
  {
    slug: 'landing-page',
    keywords: ['landing', 'homepage', 'hero', 'saas', 'startup', 'product', 'website', 'marketing', 'launch', 'company', 'service', 'agency', 'business'],
    slots: ['heroTitle', 'heroSubtitle', 'heroDescription', 'ctaText', 'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc', 'feature3Title', 'feature3Desc', 'companyName'],
  },
  {
    slug: 'portfolio',
    keywords: ['portfolio', 'resume', 'cv', 'personal', 'about me', 'projects showcase', 'developer', 'designer', 'freelancer', 'profile', 'creative', 'artist'],
    slots: ['name', 'title', 'bio', 'skill1', 'skill2', 'skill3', 'skill4', 'project1Title', 'project1Desc', 'project2Title', 'project2Desc', 'project3Title', 'project3Desc', 'email'],
  },
  {
    slug: 'dashboard',
    keywords: ['dashboard', 'analytics', 'metrics', 'charts', 'data', 'statistics', 'monitoring', 'report', 'overview', 'kpi', 'admin', 'panel', 'insights'],
    slots: ['dashboardTitle', 'metric1Label', 'metric1Value', 'metric2Label', 'metric2Value', 'metric3Label', 'metric3Value', 'metric4Label', 'metric4Value', 'chartTitle', 'tableTitle'],
  },
  {
    slug: 'tool-app',
    keywords: ['tool', 'calculator', 'converter', 'generator', 'app', 'utility', 'form', 'input', 'output', 'interactive', 'encoder', 'decoder', 'formatter'],
    slots: ['appTitle', 'appSubtitle', 'inputLabel', 'inputPlaceholder', 'outputLabel', 'buttonText', 'feature1', 'feature2', 'feature3'],
  },
  {
    slug: 'ai-agent-profile',
    keywords: ['agent', 'ai', 'bot', 'assistant', 'artificial intelligence', 'neural', 'model', 'capabilities', 'autonomous', 'llm', 'chatbot', 'machine learning'],
    slots: ['agentName', 'agentVersion', 'agentDescription', 'capability1', 'capability2', 'capability3', 'capability4', 'status', 'model', 'uptime'],
  },
  {
    slug: 'ecommerce',
    keywords: ['shop', 'store', 'ecommerce', 'e-commerce', 'buy', 'sell', 'product', 'cart', 'checkout', 'price', 'retail', 'marketplace', 'catalog', 'inventory'],
    slots: ['storeName', 'tagline', 'product1Name', 'product1Price', 'product1Desc', 'product2Name', 'product2Price', 'product2Desc', 'product3Name', 'product3Price', 'product3Desc', 'product4Name', 'product4Price', 'product4Desc', 'category1', 'category2', 'category3'],
  },
  {
    slug: 'blog',
    keywords: ['blog', 'article', 'post', 'news', 'magazine', 'journal', 'editorial', 'publication', 'content', 'writing', 'medium', 'newsletter'],
    slots: ['blogName', 'blogTagline', 'featured1Title', 'featured1Excerpt', 'featured1Author', 'featured2Title', 'featured2Excerpt', 'featured2Author', 'featured3Title', 'featured3Excerpt', 'featured3Author', 'category1', 'category2', 'category3'],
  },
  {
    slug: 'game',
    keywords: ['game', 'quiz', 'trivia', 'play', 'score', 'challenge', 'puzzle', 'question', 'answer', 'interactive game', 'brain', 'test'],
    slots: ['gameTitle', 'gameDescription', 'question1', 'answer1a', 'answer1b', 'answer1c', 'answer1correct', 'question2', 'answer2a', 'answer2b', 'answer2c', 'answer2correct', 'question3', 'answer3a', 'answer3b', 'answer3c', 'answer3correct'],
  },
  {
    slug: 'form-builder',
    keywords: ['form', 'registration', 'signup', 'sign up', 'register', 'survey', 'questionnaire', 'onboarding', 'application', 'contact form', 'subscribe', 'enrollment'],
    slots: ['formTitle', 'formDescription', 'step1Label', 'field1Label', 'field1Placeholder', 'field2Label', 'field2Placeholder', 'step2Label', 'field3Label', 'field3Placeholder', 'field4Label', 'field4Options', 'step3Label', 'field5Label', 'submitText'],
  },
];

function keywordScore(prompt: string, keywords: string[]): number {
  const lower = prompt.toLowerCase();
  let hits = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) hits++;
  }
  return hits / keywords.length;
}

export class PromptClassifier {
  constructor(private readonly llm: OpenRouterClient) {}

  async classifyPrompt(prompt: string): Promise<ClassificationResult> {
    // Step 1: Fast keyword matching
    let best = { slug: 'landing-page', score: 0 };
    for (const t of TEMPLATES) {
      const score = keywordScore(prompt, t.keywords);
      if (score > best.score) {
        best = { slug: t.slug, score };
      }
    }

    const confidence = Math.min(best.score * 3, 0.95); // scale up a bit

    if (confidence >= 0.6) {
      const template = TEMPLATES.find(t => t.slug === best.slug)!;
      return {
        templateSlug: best.slug,
        confidence,
        slots: await this.fillSlotsViaLLM(prompt, best.slug, template.slots),
      };
    }

    // Step 2: LLM classification for ambiguous prompts
    try {
      const slugs = TEMPLATES.map(t => t.slug).join(', ');
      const response = await this.llm.complete(
        [
          {
            role: 'system',
            content: `You are a prompt classifier for a web project generator. Given a mystery prompt, classify it into the BEST matching template type: ${slugs}. If no template fits well, respond with slug "none". Respond ONLY with valid JSON: {"slug": "...", "confidence": 0.0-1.0}`,
          },
          { role: 'user', content: prompt },
        ],
        'openai/gpt-4o-mini',
        256,
        0.1,
      );

      const clean = response.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
      const parsed = JSON.parse(clean) as { slug?: string; confidence?: number };

      // If classifier says "none", go full LLM generation
      if (parsed.slug === 'none') {
        return {
          templateSlug: 'none',
          confidence: 0.3,
          slots: {},
        };
      }

      const matchedTemplate = TEMPLATES.find(t => t.slug === parsed.slug) ?? TEMPLATES[0];
      const llmConfidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.7;

      return {
        templateSlug: matchedTemplate.slug,
        confidence: llmConfidence,
        slots: await this.fillSlotsViaLLM(prompt, matchedTemplate.slug, matchedTemplate.slots),
      };
    } catch {
      // Fallback: low confidence → full LLM generation path
      return {
        templateSlug: 'none',
        confidence: 0.3,
        slots: {},
      };
    }
  }

  private async fillSlotsViaLLM(prompt: string, templateSlug: string, slotNames: string[]): Promise<Record<string, string>> {
    const slotsJson = slotNames.map(s => `"${s}": "value"`).join(', ');

    const response = await this.llm.completeWithFallback(
      [
        {
          role: 'system',
          content: `You are filling content slots for a "${templateSlug}" web template. Extract relevant content from the user's prompt and fill each slot with compelling, specific copy. Be creative and professional. Respond ONLY with valid JSON (no fences): {${slotsJson}}`,
        },
        { role: 'user', content: `Prompt: ${prompt}` },
      ],
      2048,
      0.8,
    );

    const clean = response.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(clean) as Record<string, string>;

    const result: Record<string, string> = {};
    for (const slot of slotNames) {
      result[slot] = typeof parsed[slot] === 'string' && parsed[slot].trim()
        ? parsed[slot].trim()
        : slot;
    }
    return result;
  }
}
