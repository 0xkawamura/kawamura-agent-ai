import type { BuildArtifactFile } from '../types.js';
import { generateLandingPage, type LandingPageSlots } from './templates/landingPage.js';
import { generatePortfolio, type PortfolioSlots } from './templates/portfolio.js';
import { generateDashboard, type DashboardSlots } from './templates/dashboard.js';
import { generateToolApp, type ToolAppSlots } from './templates/toolApp.js';
import { generateAiAgentProfile, type AiAgentProfileSlots } from './templates/aiAgentProfile.js';
import { generateEcommerce, type EcommerceSlots } from './templates/ecommerce.js';
import { generateBlog, type BlogSlots } from './templates/blog.js';
import { generateGame, type GameSlots } from './templates/game.js';
import { generateFormBuilder, type FormBuilderSlots } from './templates/formBuilder.js';

export const TEMPLATE_SLUGS = [
  'landing-page',
  'portfolio',
  'dashboard',
  'tool-app',
  'ai-agent-profile',
  'ecommerce',
  'blog',
  'game',
  'form-builder',
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

export function generateFromTemplate(
  slug: string,
  slots: Record<string, string>,
): BuildArtifactFile[] {
  switch (slug) {
    case 'landing-page':
      return generateLandingPage(slots as unknown as LandingPageSlots);
    case 'portfolio':
      return generatePortfolio(slots as unknown as PortfolioSlots);
    case 'dashboard':
      return generateDashboard(slots as unknown as DashboardSlots);
    case 'tool-app':
      return generateToolApp(slots as unknown as ToolAppSlots);
    case 'ai-agent-profile':
      return generateAiAgentProfile(slots as unknown as AiAgentProfileSlots);
    case 'ecommerce':
      return generateEcommerce(slots as unknown as EcommerceSlots);
    case 'blog':
      return generateBlog(slots as unknown as BlogSlots);
    case 'game':
      return generateGame(slots as unknown as GameSlots);
    case 'form-builder':
      return generateFormBuilder(slots as unknown as FormBuilderSlots);
    default:
      return generateLandingPage(slots as unknown as LandingPageSlots);
  }
}
