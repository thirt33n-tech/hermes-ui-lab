#!/usr/bin/env node
// Visual diff analyzer using Claude Vision API
// Usage: node scripts/analyze-visual-diff.js [expected.png] [actual.png] [diff.png]
// Default paths: auto-detected from test-results/
// Requires: ANTHROPIC_API_KEY environment variable

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const SNAPSHOTS_DIR = 'tests/visual.spec.cjs-snapshots';
const RESULTS_DIR = 'test-results';

function findResultDir() {
  if (!existsSync(RESULTS_DIR)) return null;
  const dirs = readdirSync(RESULTS_DIR).filter(d => d.startsWith('visual-'));
  return dirs.length > 0 ? join(RESULTS_DIR, dirs[0]) : null;
}

const resultDir = findResultDir();

const expectedPath = process.argv[2] ?? join(SNAPSHOTS_DIR, 'homepage-linux.png');
const actualPath   = process.argv[3] ?? (resultDir ? join(resultDir, 'homepage-actual.png') : '');
const diffPath     = process.argv[4] ?? (resultDir ? join(resultDir, 'homepage-diff.png') : '');

function loadImage(filePath) {
  if (!filePath || !existsSync(filePath)) return null;
  return readFileSync(filePath).toString('base64');
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  const expected = loadImage(expectedPath);
  const actual   = loadImage(actualPath);
  const diff     = loadImage(diffPath);

  const missing = [
    !expected && `expected: ${expectedPath}`,
    !actual   && `actual:   ${actualPath}`,
    !diff     && `diff:     ${diffPath}`,
  ].filter(Boolean);

  if (missing.length) {
    console.error('Missing image files:\n' + missing.map(m => `  ${m}`).join('\n'));
    process.exit(1);
  }

  console.log('Analyzing visual diff with Claude Vision API...\n');
  console.log(`expected: ${expectedPath}`);
  console.log(`actual:   ${actualPath}`);
  console.log(`diff:     ${diffPath}\n`);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: `You are a visual regression analyst for a web application.
Compare the three screenshots:
[1] Expected (baseline)
[2] Actual (CI or different environment result)
[3] Diff (highlighted differences — red/yellow pixels = changed areas)

Classify the difference as exactly one of:
- "spec-change"     : Intentional UI or text content change
- "layout-bug"      : Layout broken, elements misplaced, missing, or overlapping
- "font-diff"       : Sub-pixel font rendering or anti-aliasing differences only
- "icon-diff"       : SVG or icon rendering differences only
- "rendering-diff"  : Minor rendering engine differences (shadows, borders, colors)

Return ONLY this JSON object, no other text:
{
  "classification": "<type>",
  "confidence": <0.0-1.0>,
  "reason": "<one concise sentence describing what differs>",
  "recommended_action": "<approve | fix | retry | investigate>"
}`,
        },
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data: expected } },
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data: actual } },
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data: diff } },
      ],
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

  let result;
  try {
    result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
  } catch {
    console.error('Failed to parse response:', text);
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
  console.log(`\nclassification: ${result.classification}`);
  console.log(`confidence:     ${result.confidence}`);
  console.log(`reason:         ${result.reason}`);
  console.log(`action:         ${result.recommended_action}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
