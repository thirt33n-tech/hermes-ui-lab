#!/usr/bin/env node
// Playwright failure analyzer using Claude API
// Usage: node scripts/analyze-failure.js [report-path]
// Requires: ANTHROPIC_API_KEY environment variable

import { readFileSync, writeFileSync, existsSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';

const reportPath = process.argv[2] ?? 'test-results/report.json';

function extractFailures(report) {
  const failures = [];
  for (const suite of report.suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        for (const result of test.results ?? []) {
          if (result.status === 'failed') {
            failures.push({
              title: spec.title,
              error: result.errors?.map(e => e.message).join('\n') ?? 'Unknown error',
              duration: result.duration,
            });
          }
        }
      }
    }
  }
  return failures;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }
  if (!existsSync(reportPath)) {
    console.error(`Report not found: ${reportPath}`);
    console.error('Run: npx playwright test first to generate a report.');
    process.exit(1);
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
  const failures = extractFailures(report);

  if (failures.length === 0) {
    console.log('No failures found in report.');
    return;
  }

  console.log(`Analyzing ${failures.length} failure(s) with Claude API...\n`);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analyze these Playwright test failures. Return a JSON array where each element has:
- category: "UI_CHANGE" | "SELECTOR_STALE" | "LOGIC_BUG" | "ENVIRONMENT" | "FLAKY" | "NETWORK"
- root_cause: string (one sentence)
- suggested_fix: string (one sentence)

Failures:
${failures.map((f, i) => `[${i + 1}] ${f.title}\nError: ${f.error}`).join('\n\n')}

Return only the JSON array, no other text.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  let parsed;
  try {
    parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]');
  } catch {
    console.error('Failed to parse Claude response:', text);
    parsed = [];
  }

  const outputPath = 'test-results/failure-analysis.json';
  writeFileSync(outputPath, JSON.stringify({ failures, analysis: parsed }, null, 2));

  parsed.forEach((item, i) => {
    const f = failures[i];
    if (!f) return;
    console.log(`[${i + 1}] ${f.title}`);
    console.log(`  Category: ${item.category}`);
    console.log(`  Cause:    ${item.root_cause}`);
    console.log(`  Fix:      ${item.suggested_fix}\n`);
  });

  console.log(`Saved: ${outputPath}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
