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

const SKILL_DIR = '.claude/skills/continuum-authoring';
const SKILL = `${SKILL_DIR}/SKILL.md`;
const REF_DIR = `${SKILL_DIR}/references`;
const AGENT_DIR = '.claude/agents';
const surface = JSON.parse(read('tools/surface.json'));
const skill = read(SKILL);
const agentFiles = readdirSync(join(root, AGENT_DIR)).filter((f) => f.endsWith('.md')).map((f) => `${AGENT_DIR}/${f}`);
const refFiles = existsSync(join(root, REF_DIR)) ? readdirSync(join(root, REF_DIR)).filter((f) => f.endsWith('.md')).sort() : [];
const refPath = (name) => `${REF_DIR}/${name}`;
const docs = [SKILL, ...refFiles.map(refPath), ...agentFiles, 'README.md', 'EXPERIMENT.md', 'VISION.md', 'tools/LIVE-CHECKS.md'];
const text = Object.fromEntries(docs.map((p) => [p, read(p)]));
const descriptionOf = (s) => s.match(/^---\n([\s\S]*?)\n---\n/)?.[1].match(/^description:\s*(.*)$/m)?.[1].trim() ?? '';

// Size targets (LC-6, LC-8) are measured and printed; only the ceiling fails. A target is a design aim,
// never a reason to cut an essential instruction, so the ceiling sits well above it.
const BUDGET = {
  agentBytes: { target: 6000, ceiling: 8000 },
  agentLines: { target: 80, ceiling: 110 },
  descriptionChars: { target: 300, ceiling: 400 },
};
const measurements = [];
const measure = (file, what, value, { target, ceiling }) => {
  measurements.push(`${file}: ${what} ${value} (target ${target}, ceiling ${ceiling})${value > target ? ' ABOVE TARGET' : ''}`);
  if (value > ceiling) fail(file, `${what} ${value} exceeds the ceiling ${ceiling}`);
};

// 1. Installation: exactly one agent, the architect, with frontmatter naming it and naming the skill.
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
  if (!text[f].includes('continuum-authoring')) fail(f, 'does not name the continuum-authoring skill');
  agentNames.push(base);
}
if (!/^name:\s*continuum-authoring$/m.test(skill)) fail(SKILL, 'skill frontmatter name is not continuum-authoring');

// 1b. The partner's always-loaded instructions: measured against the targets, failing only above the ceiling,
//     and with no instruction to read or load anything before the conversation starts.
for (const f of agentFiles) {
  const body = text[f];
  measure(f, 'bytes', Buffer.byteLength(body, 'utf8'), BUDGET.agentBytes);
  measure(f, 'lines', body.endsWith('\n') ? body.split('\n').length - 1 : body.split('\n').length, BUDGET.agentLines);
  measure(f, 'description chars', descriptionOf(body).length, BUDGET.descriptionChars);
  const preload = [
    /first,?\s+read/i, /read the protocol/i, /load the\b[^.\n]{0,60}\bskill first/i,
    /\bread\b[^.\n]{0,60}\bfirst\b/i, /before (?:the|your) first (?:exchange|question|reply|answer)/i,
  ];
  for (const re of preload) {
    const m = body.match(re);
    if (m) fail(f, `mandatory preload instruction: "${m[0]}"`);
  }
}
measure(SKILL, 'description chars', descriptionOf(skill).length, BUDGET.descriptionChars);
if (/read (?:this file|the protocol) first/i.test(skill)) fail(SKILL, 'the entry point asks to be read first');

// 1c. The entry point indexes its references: every reference it names exists, and every reference file is
//     named. A reference the agent names (`<name>.md`, lower case) must exist too.
{
  const named = new Set([...skill.matchAll(/references\/([A-Za-z0-9._-]+\.md)/g)].map((m) => m[1]));
  for (const n of named) if (!refFiles.includes(n)) fail(SKILL, `names references/${n}, which does not exist`);
  for (const r of refFiles) if (!named.has(r)) fail(SKILL, `does not index references/${r}`);
  if (!refFiles.length) fail(REF_DIR, 'no reference files');
  for (const f of agentFiles) {
    for (const m of text[f].matchAll(/`([a-z0-9-]+\.md)`/g)) {
      if (!refFiles.includes(m[1])) fail(f, `names ${m[1]}, which is not a reference of the skill`);
    }
  }
}

// 2. No removed agent is named anywhere, except where the README tells upgraders to delete them.
const removed = /continuum-(?:adl|bdl|tech|acceptance|diagram)-author|continuum-researcher/g;
for (const f of docs) {
  for (const line of text[f].split('\n')) {
    if (removed.test(line) && !(f === 'README.md' && /earlier version/.test(line))) fail(f, `names a removed agent: ${line.trim().slice(0, 80)}`);
    removed.lastIndex = 0;
  }
}

// 2b. The mode and authority rules are stated in the reference that holds them.
for (const [needle, name] of [
  ['Every session is intent-first unless the human explicitly asks for development-ready output', 'intent-first.md'],
  ['applies **only** when development-ready output was explicitly requested', 'development-ready.md'],
  ['Never edit an adopted file to record a proposal', 'package-and-lifecycle.md'],
  ['No in-place maintenance', 'package-and-lifecycle.md'],
  ['Never perform or claim them', 'authority-and-tools.md'],
  ['needs no Continuum artifact', 'authority-and-tools.md'],
  ['## 5. Intent-first authoring (the default)', 'intent-first.md'],
  ['## 8. Development-ready mode', 'development-ready.md'],
]) {
  const where = refPath(name);
  if (!text[where]?.includes(needle)) fail(where, `missing rule: "${needle}"`);
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
//    section ids recorded for that guide. Every other §N names its file: "`<reference>.md` §N" must be a
//    numbered section of that reference; a bare §N inside a reference must be a section of the same file; a
//    bare §N anywhere else is dangling. "`<other file>.md` §N" is that file's own section and is not checked.
const sectionsOf = new Map(refFiles.map((r) => [r, new Set([...text[refPath(r)].matchAll(/^## (\d+)\. /gm)].map((m) => m[1]))]));
const sections = new Set([...sectionsOf.values()].flatMap((s) => [...s]));
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
const fileBefore = /`([^`\s]*\.(?:md|json))`\s*(?:§[\d.]*\d[^\S\n]*(?:,|and|or|–|-)[^\S\n]*)*$/;
for (const f of docs) {
  const own = f.startsWith(`${REF_DIR}/`) ? f.slice(REF_DIR.length + 1) : null;
  for (const m of text[f].matchAll(/§([\d.]*\d)/g)) {
    if (consumed.get(f).has(m.index)) continue;
    const named = text[f].slice(Math.max(0, m.index - 120), m.index).match(fileBefore)?.[1];
    const file = named ? named.split('/').pop() : own;
    if (named && !refFiles.includes(file)) continue; // another file's own §
    if (!file) { fail(f, `dangling §${m[1]}: name the reference file it is in`); continue; }
    if (!sectionsOf.get(file)?.has(m[1])) fail(f, `§${m[1]} is not a section of ${file}`);
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

// 10b. CLI options the released client CLI does not have (skill audit 2026-11-14, CLI 0.36.3). `package build`
//      writes in place: `--out` is the toolchain's tools/development-package.mjs, never the client's, and an
//      instruction to pass it on an adopted package rewrites that package. Nor does `package check` take
//      `--change` (the change-pin proof is continuum_package_check {packageDir, changePath}).
for (const f of docs) {
  for (const line of text[f].split('\n')) {
    if (/package build[^\n]*--out\b/.test(line) && !/no `--out`/.test(line)) fail(f, `passes --out to \`continuum package build\`, which the client CLI does not have: ${line.trim().slice(0, 100)}`);
    if (/package check[^\n|]*--change\b/.test(line)) fail(f, 'passes --change to `continuum package check`, which the client CLI does not have');
    if (/requires `--out <dir>`/.test(line)) fail(f, 'says a build requires --out, which the client CLI does not have');
  }
}

// 11. The record itself is dated; warn when it is old.
const age = Math.floor((Date.now() - Date.parse(surface.verified)) / 86400000);
if (Number.isNaN(age)) fail('tools/surface.json', 'verified is not a date');
else if (age > 45) warnings.push(`tools/surface.json was last verified ${age} days ago; run tools/LIVE-CHECKS.md`);
for (const p of surface.liveProbes ?? []) if (!p.verified || !p.result) fail('tools/surface.json', `live probe without date or result: ${p.probe}`);

for (const m of measurements) console.log(`measured ${m}`);
for (const w of warnings) console.warn(`warning: ${w}`);
if (failures.length) {
  console.error(`static check failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`static check passed: ${agentNames.length} agent (${agentNames.join(', ')}), skill entry point indexing ${refFiles.length} references (${sections.size} sections), permission example checked; live surface recorded ${surface.verified} (${age} days ago, not re-verified by this check)`);
