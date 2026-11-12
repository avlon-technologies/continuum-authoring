#!/usr/bin/env node
// STATIC consistency checks for the Continuum authoring agents. No dependencies, no network.
// It compares the documents with each other and with tools/surface.json, a dated record of the
// live servers. It cannot see the servers: live verification is the procedure in tools/LIVE-CHECKS.md.
// Usage: node tools/check.mjs        (exit 1 on any failure)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const failures = [];
const warnings = [];
const fail = (file, msg) => failures.push(`${file}: ${msg}`);

const SKILL = '.claude/skills/continuum-authoring/SKILL.md';
const AGENT_DIR = '.claude/agents';
const surface = JSON.parse(read('tools/surface.json'));
const skill = read(SKILL);
const agentFiles = readdirSync(join(root, AGENT_DIR)).filter((f) => f.endsWith('.md')).map((f) => `${AGENT_DIR}/${f}`);
const docs = [SKILL, ...agentFiles, 'README.md', 'EXPERIMENT.md', 'VISION.md', 'tools/LIVE-CHECKS.md'];
const text = Object.fromEntries(docs.map((p) => [p, read(p)]));
const agentPath = (name) => `${AGENT_DIR}/continuum-${name}.md`;

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

// 3. Section references. "`<uri>` §N", "§N–§M" after a URI, and "<guide short name> §N" must be
//    section ids recorded for that guide; every other §N must be a numbered section of the skill.
const sections = new Set([...skill.matchAll(/^## (\d+)\. /gm)].map((m) => m[1]));
const guideRef = /(?:`(continuum[a-z-]*:\/\/[^`\s]+)`|\b(package-formats|development-package|development-workflow|repository-to-source))((?:\s*(?:§[\d.]*\d|–|-|,|and))+)/g;
const consumed = new Map();
for (const f of docs) {
  const spans = new Set();
  for (const m of text[f].matchAll(guideRef)) {
    const uri = m[1] ?? surface.shortNames[m[2]];
    const tail = m[3];
    const tailStart = m.index + m[0].length - tail.length;
    const ids = [...tail.matchAll(/§([\d.]*\d)/g)];
    const known = surface.sections[uri];
    for (const id of ids) {
      spans.add(tailStart + id.index);
      if (!known) fail(f, `${uri} §${id[1]}: no section ids recorded for this guide in tools/surface.json`);
      else if (!known.includes(id[1])) fail(f, `${uri} has no section ${id[1]}`);
    }
  }
  consumed.set(f, spans);
}
for (const f of docs) {
  for (const m of text[f].matchAll(/§([\d.]*\d)/g)) {
    if (consumed.get(f).has(m.index)) continue;
    if (/`[^`]*\.(md|json)`\s*$/.test(text[f].slice(Math.max(0, m.index - 60), m.index))) continue; // a file's own §
    if (!sections.has(m[1])) fail(f, `§${m[1]} is not a section of the skill`);
  }
}

// 4. Return-contract and brief field names used anywhere exist in the canonical blocks.
const block = (title) => skill.match(new RegExp(`\\*\\*${title}\\*\\*[\\s\\S]*?\`\`\`\\n([\\s\\S]*?)\`\`\``))?.[1];
const fieldsOf = (b, re) => new Set(b ? [...b.matchAll(re)].map((m) => m[1]) : []);
const fields = fieldsOf(block('Return'), /^([A-Z][A-Z-]+):/gm);
const briefFields = fieldsOf(block('Brief'), /^([A-Z][a-z-]+(?: [a-z-]+)*):/gm);
if (!fields.size) fail(SKILL, 'could not find the return block');
if (briefFields.size < 12) fail(SKILL, 'could not find the brief block');
const words = new Set(['PASS', 'PARTIAL', 'BLOCKED', 'NOT', 'CHECKED', 'UNVERIFIED', 'SELF-REVIEW', 'CLI', 'MCP', 'ADL', 'BDL', 'ADR', 'ADRS', 'PNG', 'SVG', 'JSON', 'URL']);
const inlineBriefs = new Set(['Decision', 'Alternatives', 'Constraints', 'Sources', 'Stop when']);
for (const f of docs) {
  for (const m of text[f].matchAll(/`([A-Z][A-Z-]{3,})(:[^`]*)?`/g)) {
    if (!fields.has(m[1]) && !words.has(m[1])) fail(f, `\`${m[1]}\` is not a field of the return contract`);
  }
  for (const m of text[f].matchAll(/brief(?:'s|s'| field)? `([A-Z][a-z-]+(?: [a-z-]+)*)`/g)) {
    if (!briefFields.has(m[1]) && !inlineBriefs.has(m[1])) fail(f, `brief field \`${m[1]}\` is not in the brief template`);
  }
}

// 5. Every cited Continuum tool exists on the live surface.
const tools = new Set(surface.tools);
for (const f of docs) {
  for (const m of text[f].matchAll(/\b((?:continuum|diagram)_[a-z][a-z_]*[a-z])\b/g)) {
    if (!tools.has(m[1])) fail(f, `tool ${m[1]} is not in tools/surface.json`);
  }
}

// 6. Every cited knowledge URI exists. A surface entry ending in "/" covers everything under it;
//    a cited URI ending in "/" names a family and must cover some entry.
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

// 9. Ownership: every file the skill's §5 layout assigns to an agent is named in that agent's file.
const layout = skill.match(/## 5\.[\s\S]*?```\n([\s\S]*?)```/)?.[1] ?? '';
const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/\*/g, '');
let owned = 0;
for (const m of layout.matchAll(/^\s+(\S+?),?\s+(architect|[a-z]+-author)\b/gm)) {
  const file = agentPath(m[2]);
  if (!text[file]) { fail(SKILL, `§5 layout names owner ${m[2]}, which has no definition`); continue; }
  const key = norm(m[1]);
  if (!norm(text[file]).includes(key)) fail(file, `§5 assigns ${m[1]} to ${m[2]}, but this file never names it`);
  owned++;
}
if (owned < 10) fail(SKILL, `could read only ${owned} owned paths from the §5 layout`);

// 10. Quoted limits agree with the dated record.
const L = surface.limits;
const limitPatterns = [
  [/(\d+) live (?:model )?snapshots/g, L.snapshotsPerAccount, 'live snapshots'],
  [/per account for (\d+) hours|expires (\d+) hours after import|(\d+)-hour expiry|snapshots expire after (\d+) hours/g, L.snapshotTtlHours, 'snapshot lifetime (hours)'],
  [/(\d+) KiB (?:inline|per inline call)/g, L.importInlineKiB, 'inline import limit (KiB)'],
  [/expires? after (\d+) hours idle/g, L.workspaceIdleHours, 'workspace idle expiry (hours)'],
];
for (const f of docs) {
  for (const [re, want, what] of limitPatterns) {
    for (const m of text[f].matchAll(re)) {
      const got = Number(m.slice(1).find((x) => x !== undefined));
      if (got !== want) fail(f, `${what} quoted as ${got}, but tools/surface.json records ${want}`);
    }
  }
}

// 11. The record itself is dated; warn when it is old.
const age = Math.floor((Date.now() - Date.parse(surface.verified)) / 86400000);
if (Number.isNaN(age)) fail('tools/surface.json', 'verified is not a date');
else if (age > 45) warnings.push(`tools/surface.json was last verified ${age} days ago; run tools/LIVE-CHECKS.md`);
for (const p of surface.liveProbes ?? []) if (!p.verified || !p.result) fail('tools/surface.json', `live probe without date or result: ${p.probe}`);

for (const w of warnings) console.warn(`warning: ${w}`);
if (failures.length) {
  console.error(`static check failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`static check passed: ${agentNames.length} agents, ${sections.size} skill sections, ${fields.size} return fields, ${briefFields.size} brief fields, ${owned} owned paths; live surface recorded ${surface.verified} (${age} days ago, not re-verified by this check)`);
