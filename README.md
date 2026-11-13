# Continuum Authoring

A Claude Code architecture agent that works with you to **discover, preserve and evolve the architectural intent** of a product idea, a proposed change or an existing codebase. It holds an architectural conversation, challenges questionable choices, and records the decisions that matter in Continuum artifacts: a compiled architecture model, a business model where it helps, technology bindings, decisions, principles and grounded diagrams. Architecture intent is the objective; the artifacts are its representation.

When you explicitly ask for it, the same agent produces a **development-ready Continuum package** instead: complete bindings, executable acceptance scenarios, a verified diagram set and a built, checked package, ready to hand to a developer or coding agent.

This repository is the authoring framework. It does not implement your product.

## Two authoring modes

| | **Intent-first** (default) | **Development-ready** (on explicit request) |
|---|---|---|
| Ask for it | anything else: "help me think through the architecture", "we want to add X", "model this" | "development-ready", "development package", "implementation-ready handoff for a coding agent" |
| Aim | the consequential decisions and constraints are clear and preserved | a developer can build without inventing major decisions, with verification evidence |
| Artifacts | only those that carry the intent you discussed; a thin compiling model is enough | the full set: Goal, ADL, BDL where relevant, bindings for every Environment, acceptance scenarios, final verified diagrams, the package |
| Review | none by default; one fresh review when a costly-to-reverse decision rests on the agent's reasoning alone | one independent developer review of the package |
| Ends when | sufficient architectural clarity: decisions agreed or explicitly open with an owner | every row of the readiness table holds, or the result is Partial with the gaps named |
| Ends with | a short `continuum/HANDOFF.md` (or, beside an adopted package, the change's proposal record): what intent was learned, where it is preserved, what is verifiable versus a human judgment, what can proceed, what blocks, effort spent | `continuum/HANDOFF.md` with the readiness level, evidence per artifact, gaps, review findings and retrospective |

Neither mode makes verification claims of its own. Compilation shows the model is legal, not that an implementation is correct; the agent reports what the tools that ran established, and flags which expectations deserve verification and which need human judgment. A development-ready request is never silently reduced, and an intent-first conversation is never silently turned into package production. Both modes are defined in the [protocol skill](.claude/skills/continuum-authoring/SKILL.md): §5 (intent-first) and §8 (development-ready).

## What is Continuum?

Continuum is a toolchain for writing architecture down precisely enough that tools can check it:

- **ADL** (Architecture Definition Language) models the *system*: domains, services, messages, workflows, data ownership, dependencies. A compiler checks it and attests the exact revision.
- **BDL** (Business Definition Language) models the *business*: what the organization does and means, independent of any system.
- A **development package** bundles the goal, the compiled ADL, technology **bindings** per environment (which runtime, which store) and **acceptance scenarios** into an implementation handoff.
- **Continuum Diagram** draws pictures grounded in the compiled model, labelled with how much of each picture the model actually establishes.

The specifications, guides and worked examples are served by the Continuum MCP server; the agent reads them as it works.

## What you need

| | Needed for | How to get it |
|---|---|---|
| [Claude Code](https://claude.com/claude-code) | everything | install it |
| **Continuum access** | both MCP servers | access is **by invitation** during the preview: [open an issue titled "Access request"](https://github.com/avlon-technologies/continuum-authoring/issues/new?title=Access%20request). The issue is public: give your GitHub username and a sentence on what you want to model, never an email address, credentials or confidential project details |
| Continuum MCP server | authoring and compiling ADL and BDL, knowledge | `https://mcp.continuum.dev.avlon.ca/mcp` |
| Continuum Diagram server | diagrams | `https://diagram.continuum.dev.avlon.ca/mcp` |
| `continuum` CLI (optional) | building and checking the development package | not publicly distributed yet |

Despite the `dev` in their names, these hostnames are the production preview service.

**Limits.** Continuum is a free preview and rate-limited. What the servers publish (checked 2026-11-12):

| | Limit |
|---|---|
| Diagram model snapshots | 16 live per account, no delete, each expires 24 hours after import |
| Diagram import | 64 files, 4 MiB per file, 16 MiB per package, 192 KiB per inline call (larger packages are uploaded in chunks) |
| Authoring workspaces | not durable: expire after 2 hours idle, and can be lost sooner on a server restart, scale-to-zero or eviction (more than 64 held). The agent keeps every file on disk and re-creates workspaces. |
| Other rate limits | not published. When a server refuses, the agent stops that line of work and reports it. |

The agent imports one diagram snapshot per model revision and reuses diagram runs to stay within the limits.

**Claude usage.** Claude Code usage is billed by Anthropic as usual. Both modes run as one agent; a development-ready session is much larger (every artifact, the package build, the diagram set and one review subagent). For scale: one measured intent-first conversation (two turns, one proven change, no specialists) took about 7 minutes of agent time and 45 thousand output tokens; each independent review run while maintaining this repository used 100–125 thousand tokens on its own. No development-ready session has been measured end to end.

**Your data.** The Continuum servers are hosted by Avlon. Every Architect tool states that it is answered on hosted infrastructure from content supplied with the request or held in a hosted workspace, never read from your machine. What the agent send is therefore processed there: model and business documents, bindings, scenarios when checked, file paths and line ranges from your code, and any code an agent quotes. No privacy or data-retention policy for the preview is published with the servers or this repository; ask in your access issue before using a repository whose architecture you may not share with a third party.

### What you get with and without the CLI

The MCP servers handle authoring, compiling, querying, behaviour preview and change-proving for ADL and BDL, plus diagrams. Validating bindings and scenarios, building and checking the package, the evidence file, and the lifecycle acts (approve, accept, adopt) exist only in the CLI today.

| | MCP only (public default) | MCP + CLI |
|---|---|---|
| ADL model, compiled and attested | yes | yes |
| Architecture changes proved (`apply(A, Δ) = B`) | yes | yes |
| BDL model, compiled | yes | yes |
| Diagrams | yes | yes |
| Bindings and scenarios | drafted, each reference confirmed by query; completeness and coverage **UNVERIFIED** | validated by the package build |
| Development package built and checked | no | yes |
| Highest honest result (development-ready mode) | **Authored — package UNVERIFIED** | **Development-ready** |

Intent-first conversations need only the Continuum MCP server, plus the Diagram server when a picture helps. In development-ready mode the agent tells you at the start which route you are on, and it never claims a check that did not run. What each route can author, verify and leave unverified, artifact by artifact, is in the [skill's tool routes](.claude/skills/continuum-authoring/SKILL.md#2-tool-routes-mcp-first-cli-optional).

## Setup

1. **Connect the MCP servers** (once per machine; add `--scope project` to share them with your team through `.mcp.json`):

   ```sh
   claude mcp add --transport http continuum https://mcp.continuum.dev.avlon.ca/mcp
   claude mcp add --transport http continuum-diagram https://diagram.continuum.dev.avlon.ca/mcp
   ```

   Start Claude Code, run `/mcp`, choose each server and sign in in the browser window it opens (OAuth), with the account you were invited with. If sign-in or the first tool call fails, check that your invitation is active.

2. **Install the agent and its protocol.** Two files are the whole installation:

   ```
   <your-project>/.claude/
     agents/continuum-architect.md              the agent
     skills/continuum-authoring/SKILL.md        the protocol it follows
   ```

   ```sh
   git clone https://github.com/avlon-technologies/continuum-authoring.git
   mkdir -p <your-project>/.claude/agents <your-project>/.claude/skills
   cp continuum-authoring/.claude/agents/continuum-architect.md <your-project>/.claude/agents/
   cp -r continuum-authoring/.claude/skills/continuum-authoring <your-project>/.claude/skills/
   ```

   To use it in every project instead, copy the same two paths under `~/.claude/`. In Claude Code, `/agents` should list `continuum-architect`. If you installed an earlier version, delete its six specialist agent files (`continuum-adl-author`, `-bdl-author`, `-tech-author`, `-acceptance-author`, `-diagram-author`, `continuum-researcher`); they are no longer used.

3. **Permissions (optional).** Claude Code asks before each tool call. To approve the Continuum tools once for the project, add to `<your-project>/.claude/settings.json`:

   ```json
   {
     "permissions": {
       "allow": [
         "mcp__continuum__*", "mcp__continuum-diagram__*",
         "mcp__claude_ai_Continuum_Architect__*", "mcp__claude_ai_Continuum_Diagram__*",
         "Bash(continuum --version)", "Bash(continuum status *)", "Bash(continuum compile *)",
         "Bash(continuum apply *)", "Bash(continuum preview *)", "Bash(continuum diff *)",
         "Bash(continuum package check *)", "Bash(continuum icp check *)",
         "Bash(continuum icp state *)", "Bash(continuum icp ready * --no-execute)", "Bash(base64 *)"
       ],
       "deny": [
         "Bash(continuum icp approve *)", "Bash(continuum icp accept *)", "Bash(continuum icp adopt *)",
         "Bash(continuum icp reject *)", "Bash(continuum icp abandon *)", "Bash(continuum icp supersede *)",
         "Bash(continuum icp delete *)", "Bash(continuum ledger record *)", "Bash(continuum package accept *)",
         "Bash(continuum decision accept *)", "Bash(continuum decision reject *)", "Bash(continuum decision revoke *)",
         "Bash(continuum decision supersede *)", "Bash(continuum decision delegate *)", "Bash(continuum decision govern *)",
         "Bash(continuum principle activate *)", "Bash(continuum principle approve *)", "Bash(continuum principle deny *)",
         "Bash(continuum principle reject *)", "Bash(continuum principle revoke *)", "Bash(continuum principle supersede *)",
         "Bash(continuum principle retire *)", "Bash(continuum principle delegate *)", "Bash(continuum principle govern *)",
         "PowerShell(continuum icp approve *)", "PowerShell(continuum icp accept *)", "PowerShell(continuum icp adopt *)",
         "PowerShell(continuum icp reject *)", "PowerShell(continuum icp abandon *)", "PowerShell(continuum icp supersede *)",
         "PowerShell(continuum icp delete *)", "PowerShell(continuum ledger record *)", "PowerShell(continuum package accept *)",
         "PowerShell(continuum decision accept *)", "PowerShell(continuum decision reject *)", "PowerShell(continuum decision revoke *)",
         "PowerShell(continuum decision supersede *)", "PowerShell(continuum decision delegate *)", "PowerShell(continuum decision govern *)",
         "PowerShell(continuum principle activate *)", "PowerShell(continuum principle approve *)", "PowerShell(continuum principle deny *)",
         "PowerShell(continuum principle reject *)", "PowerShell(continuum principle revoke *)", "PowerShell(continuum principle supersede *)",
         "PowerShell(continuum principle retire *)", "PowerShell(continuum principle delegate *)", "PowerShell(continuum principle govern *)",
         "mcp__continuum__continuum_decision_accept", "mcp__continuum__continuum_decision_reject",
         "mcp__continuum__continuum_decision_supersede", "mcp__continuum__continuum_decision_revoke",
         "mcp__claude_ai_Continuum_Architect__continuum_decision_accept",
         "mcp__claude_ai_Continuum_Architect__continuum_decision_reject",
         "mcp__claude_ai_Continuum_Architect__continuum_decision_supersede",
         "mcp__claude_ai_Continuum_Architect__continuum_decision_revoke"
       ]
     }
   }
   ```

   - MCP rules match the tool names Claude Code shows, `mcp__<server>__<tool>`. The example covers both ways of connecting: servers added with step 1 (`mcp__continuum__…`, `mcp__continuum-diagram__…`) and the claude.ai connectors (`mcp__claude_ai_Continuum_Architect__…`, `mcp__claude_ai_Continuum_Diagram__…`); rules for a server you did not connect are inert. If you named the servers differently, rename every MCP entry, deny entries included, or they protect nothing. Connect the Continuum server one way only: with both connected, a session sees two copies of every tool and may call the one your settings do not allow (observed in a 2026-11-13 trial, where calls to the unallowed copy were denied). Verified on 2026-11-13 in a headless session: a `mcp__claude_ai_Continuum_Architect__*` allow rule admitted the connector's tools without prompting.
   - **The `deny` list keeps your authority yours.** Approving, accepting, adopting, rejecting, abandoning, superseding or deleting a transition, accepting a package, recording a ledger checkpoint, and disposing of a Continuum decision or principle are your acts, never an agent's. Per the [Claude Code permissions documentation](https://code.claude.com/docs/en/permissions.md), deny is evaluated before allow in every settings scope, and a Bash deny rule matches any part of a compound command and past leading variable assignments; per the [subagents documentation](https://code.claude.com/docs/en/sub-agents.md), a settings-level Bash deny rule also applies to subagents. Each Bash rule has a `PowerShell(…)` twin because Windows sessions also run commands through the PowerShell tool; the documentation gives PowerShell rules the same shape but does not say whether its deny rules match inside compound commands. It is a backstop, not a security boundary: a rule does not match the same program run another way (`npx continuum …`, `sh -c "…"`, a full path). The agent is also instructed never to perform these acts.
   - Commands that write files (`continuum package build`, `bind`, `realize`, `icp init`, `icp materialize`) are deliberately not pre-approved, so Claude Code asks each time; on a repository with an adopted package the agent run the in-place ones only on scratch copies.
   - `curl` (saving diagram images from their signed links) is deliberately left out: a broad `curl` rule would allow any network call, so Claude Code asks each time.
   - File edits are still confirmed. The agent is instructed to write only under `continuum/`; that is an instruction, not an enforced limit.

## Usage

From your project, start Claude Code **with the agent as the main session**:

```sh
claude --agent continuum-architect
```

Running it as the main session keeps it in conversation with you. It does not need to start other agents; in development-ready mode it may start one built-in reviewer subagent, which only a main session can do.

### Intent-first (default)

Describe the product or the change, for example:

> We want to let customers share a workspace with outside collaborators. Help me work out the architecture and record what we decide.

What happens:

1. The agent reads the repository and any existing `continuum/` model, then tells you its understanding and the few decisions it thinks matter (costly to reverse, crossing an ownership, trust or data boundary).
2. It asks only questions whose answers change the architecture, each with a recommended default, and pushes back on choices that look questionable, offering a simpler alternative. You decide.
3. It preserves what you agreed where it belongs: the ADL model (or an `.adl-change` to an existing one), BDL when business rules are the hard part, a binding for a consequential technology choice, decisions and principles in the Continuum decision space or `continuum/GOAL.md`, and a diagram when a picture helps. It compiles what it touches.
4. It classifies the important expectations as verifiable, indirectly testable or human judgment, and names the few worth verifying.
5. It stops once the architecture is clear enough to proceed, and writes a short `continuum/HANDOFF.md`, including the effort spent. It offers development-ready mode but does not start it.

**If your repository already has an adopted package** (a `continuum/ledger.json` with a current checkpoint), the conversation produces a *proposed change*, never an edit to what you adopted. The architecture goes in `continuum/model/changes/<name>.adl-change`, proven to apply to the adopted state. The decisions, rationale, open questions and verification opportunities go in `continuum/model/changes/<name>.proposal.md` beside it. `GOAL.md`, `HANDOFF.md`, the model, bindings and scenarios of the adopted package are left untouched, and its readiness claims keep holding for the adopted state. Adopting the change stays yours, through the existing transition lifecycle (`continuum icp init`, then `continuum icp ready`); a development-ready request on such a repository moves the proposal into that transition (its `REASON.md`, changed bindings and scenarios), checks it, and stops at your approval. It never adopts it.

### Development-ready (explicit request)

> Author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings for local development, acceptance scenarios, and Continuum diagrams. Do not implement the product. Show validation evidence and gaps.

What happens:

1. The agent checks which servers and tools are available, surveys the repository, and asks you a few high-value questions about user journeys, constraints and costly-to-reverse choices. It challenges assumptions and suggests what does not need modeling.
2. It authors the whole architecture itself, as one coherent design: Goal, ADL, BDL where relevant, bindings for every Environment, acceptance scenarios and the final diagram set.
3. It shows you the diagrams, with their labels: a *provisional proposal* is for reaction; only a *verified* diagram is a deliverable.
4. A fresh reviewer subagent challenges the finished package as a developer would, identifying contradictions, vacuous tests and decisions it would still need to invent.
5. Everything lands in your repository's `continuum/` directory, ending with `continuum/HANDOFF.md`: the readiness level reached, a status and evidence table, open gaps and choices, the biggest blockers, the effort spent and a retrospective.

## What is in this repository

| Path | Purpose |
|---|---|
| [`.claude/agents/continuum-architect.md`](.claude/agents/continuum-architect.md) | The agent: how it runs the conversation |
| [`.claude/skills/continuum-authoring/SKILL.md`](.claude/skills/continuum-authoring/SKILL.md) | The protocol: authority, tool routes, lifecycle, both modes, how to author each artifact |
| [`VISION.md`](VISION.md), [`EXPERIMENT.md`](EXPERIMENT.md) | Why it is designed this way, and how to evaluate a session |
| [`tools/`](tools/LIVE-CHECKS.md) | Maintainer checks (below); not installed |

## Known limitations

- Binding validation, scenario validation, the evidence file, the package build and the lifecycle acts need the CLI, which is not public yet; MCP-only development-ready sessions stop at **Authored — package UNVERIFIED**.
- The guides' package layouts do not list the `.bdl` business model, so whether the package build includes it is unverified.
- `continuum_process_graph` refuses queries through MCP; the agent uses `continuum_preview`, which returns the same causal traces from every entry message.
- Binding checks through a diagram import have not been exercised live yet (diagram quota).
- The Diagram server's snapshot limit can block new diagrams until older snapshots expire. A development-ready session whose final diagrams are blocked ends at **Partial**, with the planned views recorded so they can run later.
- The agent produces architecture, not code, and its judgments of quality and fitness are reasoning, not proof. Only the compilers' verdicts are proof, and only of legality.

## Maintaining this repository

Two kinds of check, kept apart:

- **Static** — `node tools/check.mjs`, run by CI on every push. No network. It checks that the installation is exactly the one agent and the skill, that every skill and guide section reference resolves, that no removed agent is still named, that the README's permission example parses, allows nothing broad and denies every human-only act, quoted limits, links and known-stale terms; and that every cited tool, knowledge URI and guide section is in `tools/surface.json`, a dated record of the live servers. It catches drift in names, references and numbers, not contradictions in meaning.
- **Live** — [`tools/LIVE-CHECKS.md`](tools/LIVE-CHECKS.md), run by a maintainer with both servers connected before each release: refresh the record, re-run the route probes, and re-read the guide sections the agents rely on. The static check warns when the record is more than 45 days old.

## License

[MIT](LICENSE)
