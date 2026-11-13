#!/usr/bin/env node
// STATIC consistency checks for the continuum-architect agent and its skill. No dependencies, no network.
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

// 1. Installation: exactly one agent, the architect, with frontmatter naming it and pointing to the skill.
const AGENT = `${AGENT_DIR}/continuum-architect.md`;
const agentNames = [];
if (agentFiles.length !== 1 || agentFiles[0] !== AGENT) fail(AGENT_DIR, `expected only continuum-architect.md, found ${agentFiles.join(', ') || 'none'}`);
for (const f of agentFiles) {
  const fm = text[f].match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { fail(f, 'missing frontmatter'); continue; }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const base = f.split('/').pop().replace(/\.md$/, '');
  if (name !== base) fail(f, `frontmatter name "${name}" does not match file name "${base}"`);
  if (!/^description:\s*\S/m.test(fm[1])) fail(f, 'frontmatter has no description');
  if (/^tools:/m.test(fm[1])) fail(f, 'the architect must keep the full tool set (no tools: line)');
  if (!text[f].includes('.claude/skills/continuum-authoring/SKILL.md')) fail(f, 'does not point to the skill');
  agentNames.push(base);
}
if (!/^name:\s*continuum-authoring$/m.test(skill)) fail(SKILL, 'skill frontmatter name is not continuum-authoring');

// 2. No removed agent is named anywhere, except where the README tells upgraders to delete them.
const removed = /continuum-(?:adl|bdl|tech|acceptance|diagram)-author|continuum-researcher/g;
for (const f of docs) {
  for (const line of text[f].split('\n')) {
    if (removed.test(line) && !(f === 'README.md' && /earlier version/.test(line))) fail(f, `names a removed agent: ${line.trim().slice(0, 80)}`);
    removed.lastIndex = 0;
  }
}

// 2b. The mode rules are stated where the agent reads them.
for (const [needle, where] of [
  ['Every session is intent-first unless the human explicitly asks for development-ready output', SKILL],
  ['applies **only** when development-ready output was explicitly requested', SKILL],
  ['Never edit an adopted file to record a proposal', SKILL],
  ['No in-place maintenance', SKILL],
  ['Never perform or claim them', SKILL],
  ['## 5. Intent-first authoring (the default)', SKILL],
  ['## 8. Development-ready mode', SKILL],
]) {
  if (!text[where].includes(needle)) fail(where, `missing rule: "${needle}"`);
}

// 2c. README permission example: parses, allows nothing broad, denies every human-only act.
{
  const readme = text['README.md'];
  const fence = '```json\n';
  const at = readme.indexOf(fence);
  let perms;
  try { perms = JSON.parse(readme.slice(at + fence.length, readme.indexOf('```', at + fence.length))).permissions; } catch (e) { fail('README.md', `permission example does not parse: ${e.message}`); }
  if (perms) {
    const okAllow = /^(mcp__[A-Za-z_-]+__\*|(Bash|PowerShell)\((continuum (--version|status \*|compile \*|apply \*|preview \*|diff \*|package check \*|icp check \*|icp state \*|icp ready \* --no-execute)|base64 \*)\))$/;
    for (const r of perms.allow) if (!okAllow.test(r)) fail('README.md', `permission example allows something broad or unexpected: ${r}`);
    const acts = ['icp approve', 'icp accept', 'icp adopt', 'icp reject', 'icp abandon', 'icp supersede', 'icp delete', 'ledger record', 'package accept',
      ...['accept', 'reject', 'revoke', 'supersede', 'delegate', 'govern'].map((v) => `decision ${v}`),
      ...['activate', 'approve', 'deny', 'reject', 'revoke', 'supersede', 'retire', 'delegate', 'govern'].map((v) => `principle ${v}`)];
    for (const shell of ['Bash', 'PowerShell']) for (const a of acts) if (!perms.deny.includes(`${shell}(continuum ${a} *)`)) fail('README.md', `permission example does not deny ${shell}(continuum ${a} *)`);
    const servers = [...new Set(perms.allow.filter((r) => r.startsWith('mcp__') && !/diagram/i.test(r)).map((r) => r.replace(/\*$/, '')))];
    for (const p of servers) for (const t of ['accept', 'reject', 'supersede', 'revoke']) if (!perms.deny.includes(`${p}continuum_decision_${t}`)) fail('README.md', `permission example allows ${p}* but does not deny ${p}continuum_decision_${t}`);
  }
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
console.log(`static check passed: ${agentNames.length} agent (${agentNames.join(', ')}), ${sections.size} skill sections, permission example checked; live surface recorded ${surface.verified} (${age} days ago, not re-verified by this check)`);
