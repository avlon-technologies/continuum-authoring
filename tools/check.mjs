#!/usr/bin/env node
// Branch-wide static consistency checks for the architecture-intent experiment.
// Enumerates every tracked file via git, validates Markdown links, and checks active instructions.
// Does not contact Continuum or prove semantic model quality.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);
const read = p => readFileSync(join(root,p),'utf8').replace(/\r\n/g,'\n');
const required = [
  'CLAUDE.md','README.md','VISION.md','EXPERIMENT.md',
  '.claude/skills/continuum-authoring/SKILL.md',
  '.claude/agents/intent-orchestrator.md','.claude/agents/intent-author.md',
  'experiments/architecture-intent/README.md',
  'experiments/architecture-intent/CHARTER.md',
  'experiments/architecture-intent/AGENT-CONTRACTS.md',
  'experiments/architecture-intent/RUNBOOK.md',
  'experiments/architecture-intent/QUALITY-RUBRIC.md',
  'experiments/architecture-intent/PROGRESS-CONTRACT.md',
  'experiments/architecture-intent/COMPARISON-PROTOCOL.md',
  'experiments/architecture-intent/CONTROL-BASELINE.md',
  'experiments/architecture-intent/EVALUATOR.md',
  'tools/LIVE-CHECKS.md','tools/surface.json'
];
for (const p of required) if (!existsSync(join(root,p))) fail(p,'required file missing');

const agentDir = join(root,'.claude/agents');
const agents = existsSync(agentDir) ? readdirSync(agentDir).filter(x=>x.endsWith('.md')).sort() : [];
if (agents.join(',') !== 'intent-author.md,intent-orchestrator.md')
  fail('.claude/agents','expected exactly intent-author.md and intent-orchestrator.md; got '+agents.join(','));
for(const filename of agents){
  const p='.claude/agents/'+filename, s=read(p);
  const fm=s.match(/^---\n([\s\S]*?)\n---\n/);
  if(!fm){fail(p,'missing YAML frontmatter');continue;}
  const name=fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if(name!==filename.slice(0,-3)) fail(p,'frontmatter name does not match filename');
  if(!/^description:\s*\S/m.test(fm[1])) fail(p,'missing description');
  if(!s.includes('.claude/skills/continuum-authoring/SKILL.md')) fail(p,'must reference canonical skill');
}
const active = [
  'CLAUDE.md','README.md','VISION.md','EXPERIMENT.md',
  '.claude/skills/continuum-authoring/SKILL.md',
  ...agents.map(a=>'.claude/agents/'+a),
  ...required.filter(p=>p.startsWith('experiments/'))
];
for(const p of active){
  if(!existsSync(join(root,p)))continue;
  const s=read(p);
  if(s.includes('experiment/RUNBOOK.md')||s.includes('experiment/QUALITY-RUBRIC.md'))
    fail(p,'stale singular experiment/ path');
  if(/claude --agent continuum-architect/.test(s) && !/do not|not |legacy|original/i.test(s))
    fail(p,'legacy coordinator invocation');
}
let tracked=[];
try { tracked=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean); }
catch(e){fail('git','unable to enumerate tracked files: '+e.message);}
for(const p of tracked){
  if(!existsSync(join(root,p))||!statSync(join(root,p)).isFile())continue;
  if(extname(p)!=='.md')continue;
  const s=read(p);
  // Resolve ordinary relative Markdown links; ignore anchors, external URLs and templates.
  for(const match of s.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
    const raw=match[1].trim().split(/\s+"/)[0];
    if(!raw||raw.startsWith('#')||/^(?:[a-z]+:|\/\/)/i.test(raw)||raw.includes('<'))continue;
    const target=decodeURIComponent(raw.split('#')[0].split('?')[0]);
    if(!target)continue;
    const absolute=resolve(root,dirname(p),target);
    if(!absolute.startsWith(root+'/')&&!absolute.startsWith(root+'\\')){fail(p,'link escapes repository: '+raw);continue;}
    if(!existsSync(absolute))fail(p,'broken relative link: '+raw);
  }
}
if(existsSync(join(root,'experiment'))) {
  // A stale duplicate experiment directory must not be reintroduced.
  const leftover=readdirSync(join(root,'experiment'));
  if(leftover.length)fail('experiment/','duplicate experiment tree exists: '+leftover.join(','));
}
if(problems.length){console.error('FAIL: '+problems.length+' architecture-intent consistency issues\n'+problems.join('\n'));process.exit(1);}
console.log('PASS: two agents, required contracts, active instruction references and '+tracked.length+' tracked file paths inspected (Markdown links checked).');
console.log('NOTE: static consistency only; Continuum live validation and semantic evaluation remain separate.');
