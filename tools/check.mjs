#!/usr/bin/env node
// Consistency checks for the Continuum authoring agents. No dependencies.
// Usage: node tools/check.mjs        (exit 1 on any failure)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const failures = [];
const fail = (file, msg) => failures.push(`${file}: ${msg}`);

const SKILL = '.claude/skills/continuum-authoring/SKILL.md';
const AGENT_DIR = '.claude/agents';
const surface = JSON.parse(read('tools/surface.json'));
const skill = read(SKILL);
const agentFiles = readdirSync(join(root, AGENT_DIR)).filter((f) => f.endsWith('.md')).map((f) => `${AGENT_DIR}/${f}`);
const docs = [SKILL, ...agentFiles, 'README.md', 'EXPERIMENT.md', 'VISION.md'];
const text = Object.fromEntries(docs.map((p) => [p, read(p)]));

// 1. Agent frontmatter: name matches file name, description present, skill referenced.
const agentNames = [];
for (const f of agentFiles) {
  const fm = text[f].match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { fail(f, 'missing frontmatter'); continue; }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const base = f.split('/').pop().replace(/\.md$/, '');
  if (name !== base) fail(f, `frontmatter name "${name}" does not match file name "${base}"`);
  if (!/^description:\s*\S/m.test(fm[1])) fail(f, 'frontmatter has no description');
  if (!text[f].includes('.claude/skills/continuum-authoring/SKILL.md')) fail(f, 'does not point to the shared skill');
  agentNames.push(base);
}

// 2. The team table in the skill and the agent table in the README list exactly the agents on disk.
const tableAgents = (src) => new Set([...src.matchAll(/^\| \[?`(continuum-[a-z-]+)`/gm)].map((m) => m[1]));
for (const [file, set] of [[SKILL, tableAgents(skill)], ['README.md', tableAgents(text['README.md'])]]) {
  for (const a of agentNames) if (!set.has(a)) fail(file, `agent table is missing ${a}`);
  for (const a of set) if (!agentNames.includes(a)) fail(file, `agent table lists ${a}, which has no definition`);
}

// 3. Section references (§N) resolve to a numbered top-level section of the skill.
const sections = new Set([...skill.matchAll(/^## (\d+)\. /gm)].map((m) => m[1]));
for (const f of docs) {
  for (const m of text[f].matchAll(/§(\d+)(?![.\d])/g)) {
    // References into Continuum guides ("package-formats §2") are not skill sections.
    const before = text[f].slice(Math.max(0, m.index - 60), m.index);
    if (/continuum(-host|-mcp)?:\/\/\S+\s*$/.test(before) || /`[^`]*\.(md|json)`\s*$/.test(before)) continue;
    if (!sections.has(m[1])) fail(f, `§${m[1]} is not a section of the skill`);
  }
}

// 4. Return-contract field names used anywhere exist in the canonical return block.
const block = skill.match(/\*\*Return\*\*[\s\S]*?```\n([\s\S]*?)```/);
const fields = new Set(block ? [...block[1].matchAll(/^([A-Z][A-Z-]+):/gm)].map((m) => m[1]) : []);
if (!fields.size) fail(SKILL, 'could not find the return block');
const words = new Set(['PASS', 'PARTIAL', 'BLOCKED', 'NOT', 'CHECKED', 'UNVERIFIED', 'SELF-REVIEW', 'CLI', 'MCP', 'ADL', 'BDL', 'ADR', 'ADRS', 'PNG', 'SVG', 'JSON', 'URL']);
for (const f of docs) {
  for (const m of text[f].matchAll(/`([A-Z][A-Z-]{3,})(:[^`]*)?`/g)) {
    if (!fields.has(m[1]) && !words.has(m[1])) fail(f, `\`${m[1]}\` is not a field of the return contract`);
  }
}

// 5. Every cited Continuum tool exists on the live surface.
const tools = new Set(surface.tools);
for (const f of docs) {
  for (const m of text[f].matchAll(/\b((?:continuum|diagram)_[a-z][a-z_]*[a-z])\b/g)) {
    if (!tools.has(m[1])) fail(f, `tool ${m[1]} is not in tools/surface.json`);
  }
}

// 6. Every cited knowledge URI exists on the live surface. A snapshot entry ending in "/" covers
//    everything under it; a cited URI ending in "/" names a family and must cover some entry.
const uris = surface.uris;
for (const f of docs) {
  for (const m of text[f].matchAll(/continuum(?:-host|-mcp)?:\/\/[A-Za-z0-9._\/-]+/g)) {
    const uri = m[0].replace(/\.+$/, '');
    const ok = uris.includes(uri)
      || uris.some((u) => u.endsWith('/') && uri.startsWith(u))
      || (uri.endsWith('/') && uris.some((u) => u.startsWith(uri)));
    if (!ok) fail(f, `knowledge URI ${uri} is not in tools/surface.json`);
  }
}

// 7. Known-stale terms.
for (const f of docs) {
  for (const { term, why } of surface.staleTerms) if (text[f].includes(term)) fail(f, `stale term "${term}" (${why})`);
}

// 8. Relative Markdown links resolve, including anchors into Markdown files.
const slug = (h) => h.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s/g, '-');
for (const f of docs) {
  for (const m of text[f].matchAll(/\]\((?!https?:|mailto:)([^)#\s]*)(#[^)\s]*)?\)/g)) {
    const target = m[1] ? join(dirname(f), m[1]) : f;
    if (!existsSync(join(root, target))) { fail(f, `broken link ${m[0]}`); continue; }
    if (m[2] && target.endsWith('.md')) {
      const anchors = new Set([...read(target).matchAll(/^#+ (.+)$/gm)].map((h) => slug(h[1])));
      if (!anchors.has(m[2].slice(1))) fail(f, `broken anchor ${m[0]}`);
    }
  }
}

if (failures.length) {
  console.error(`check failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`check passed: ${agentNames.length} agents, ${sections.size} skill sections, ${fields.size} return fields, surface verified ${surface.verified}`);
