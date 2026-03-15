import type { BuildArtifactFile } from '../types.js';

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateFiles(files: BuildArtifactFile[]): ValidationResult {
  const issues: string[] = [];

  if (files.length === 0) {
    issues.push('No files generated.');
    return { valid: false, issues };
  }

  const hasIndex = files.some(f => f.path === 'index.html' || f.path.endsWith('/index.html'));
  if (!hasIndex) {
    issues.push('Missing index.html — required for static output.');
  }

  for (const file of files) {
    if (!file.path || file.path.trim().length === 0) {
      issues.push('File with empty path found.');
    }
    if (!file.content || file.content.trim().length === 0) {
      issues.push(`File "${file.path}" has empty content.`);
    }
    if (file.path.includes('..')) {
      issues.push(`Unsafe path detected: "${file.path}"`);
    }
  }

  const indexFile = files.find(f => f.path === 'index.html');
  if (indexFile) {
    const html = indexFile.content;

    // Structure checks
    if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
      issues.push('index.html is missing HTML structure.');
    }
    if (!html.includes('</body>') && !html.includes('</html>')) {
      issues.push('index.html may be incomplete (missing closing tags).');
    }

    // Mobile-friendliness (critical for Design score)
    if (!html.includes('viewport')) {
      issues.push('Missing <meta name="viewport"> — not mobile-friendly.');
    }

    // SEO basics
    if (!html.includes('<title>') && !html.includes('<title ')) {
      issues.push('Missing <title> tag — bad for SEO.');
    }

    // Language attribute
    if (!html.includes('lang=')) {
      issues.push('Missing lang attribute on <html> — accessibility issue.');
    }

    // Check for at least some interactivity
    const hasInteractivity =
      html.includes('onclick') ||
      html.includes('addEventListener') ||
      html.includes('oninput') ||
      html.includes('onsubmit') ||
      html.includes('onchange');
    if (!hasInteractivity) {
      issues.push('No interactive elements found — consider adding onclick handlers or event listeners.');
    }

    // Responsive design check
    const hasResponsive =
      html.includes('@media') ||
      html.includes('clamp(') ||
      html.includes('auto-fit') ||
      html.includes('auto-fill');
    if (!hasResponsive) {
      issues.push('No responsive CSS detected — add @media queries or clamp().');
    }

    // Basic JS error prevention: check for common issues
    const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatch) {
      for (const scriptBlock of scriptMatch) {
        const jsContent = scriptBlock.replace(/<\/?script[^>]*>/gi, '');
        // Check for common issues
        if (jsContent.includes('undefined(') || jsContent.includes('.undefined')) {
          issues.push('Possible JS error: reference to "undefined".');
        }
      }
    }
  }

  return { valid: issues.length === 0, issues };
}
