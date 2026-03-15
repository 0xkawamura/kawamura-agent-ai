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

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function applyAccentColor(files: BuildArtifactFile[], accentColor: string): BuildArtifactFile[] {
  const rgb = hexToRgb(accentColor);
  return files.map(f => ({
    ...f,
    content: f.content
      .replace(/#D2FF55/g, accentColor)
      .replace(/210,255,85/g, rgb),
  }));
}

export function generateFromTemplate(
  slug: string,
  slots: Record<string, string>,
  accentColor?: string,
): BuildArtifactFile[] {
  let files: BuildArtifactFile[];
  switch (slug) {
    case 'landing-page':      files = generateLandingPage(slots as unknown as LandingPageSlots); break;
    case 'portfolio':         files = generatePortfolio(slots as unknown as PortfolioSlots); break;
    case 'dashboard':         files = generateDashboard(slots as unknown as DashboardSlots); break;
    case 'tool-app':          files = generateToolApp(slots as unknown as ToolAppSlots); break;
    case 'ai-agent-profile':  files = generateAiAgentProfile(slots as unknown as AiAgentProfileSlots); break;
    case 'ecommerce':         files = generateEcommerce(slots as unknown as EcommerceSlots); break;
    case 'blog':              files = generateBlog(slots as unknown as BlogSlots); break;
    case 'game':              files = generateGame(slots as unknown as GameSlots); break;
    case 'form-builder':      files = generateFormBuilder(slots as unknown as FormBuilderSlots); break;
    default:                  files = generateLandingPage(slots as unknown as LandingPageSlots); break;
  }
  return accentColor ? applyAccentColor(files, accentColor) : files;
}
