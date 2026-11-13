# Continuum Authoring

A Claude Code architecture agent that works with you to **discover, preserve and evolve the architectural intent** of a product idea, a proposed change or an existing codebase. It holds an architectural conversation, challenges questionable choices, and records the decisions that matter in Continuum artifacts: a compiled architecture model, a business model where it helps, technology bindings, decisions, principles and grounded diagrams. Architecture intent is the objective; the artifacts are its representation.

When you explicitly ask for it, the same agent, with optional specialist advisers, produces a **development-ready Continuum package** instead: complete bindings, executable acceptance scenarios, a verified diagram set and a built, checked package, ready to hand to a developer or coding agent.

This repository is the authoring framework. It does not implement your product.

## Two authoring modes

| | **Intent-first** (default) | **Development-ready** (on explicit request) |
|---|---|---|
| Ask for it | anything else: "help me think through the architecture", "we want to add X", "model this" | "development-ready", "development package", "implementation-ready handoff for a coding agent" |
| Aim | the consequential decisions and constraints are clear and preserved | a developer can build without inventing major decisions, with verification evidence |
| Artifacts | only those that carry the intent you discussed; a thin compiling model is enough | the full set: Goal, ADL, BDL where relevant, bindings for every Environment, acceptance scenarios, final verified diagrams, the package |
| Specialists and review | none by default; used only when a bounded question or risk warrants it | optional advisers; one early and one final independent review |
| Ends when | sufficient architectural clarity: decisions agreed or explicitly open with an owner | every row of the readiness table holds, or the result is Partial with the gaps named |
| Ends with | a short `continuum/HANDOFF.md`: what intent was learned, where it is preserved, what is verifiable versus a human judgment, what can proceed, what blocks, effort spent | `continuum/HANDOFF.md` with the readiness level, evidence per artifact, gaps, review findings and retrospective |

Neither mode makes verification claims of its own. Compilation shows the model is legal, not that an implementation is correct; the agent reports what the tools that ran established, and flags which expectations deserve verification and which need human judgment. A development-ready request is never silently reduced, and an intent-first conversation is never silently turned into package production. Both modes are defined in the [shared skill](.claude/skills/continuum-authoring/SKILL.md): §7 (intent-first) and §9 (development-ready).

## What is Continuum?

Continuum is a toolchain for writing architecture down precisely enough that tools can check it:

- **ADL** (Architecture Definition Language) models the *system*: domains, services, messages, workflows, data ownership, dependencies. A compiler checks it and attests the exact revision.
- **BDL** (Business Definition Language) models the *business*: what the organization does and means, independent of any system.
- A **development package** bundles the goal, the compiled ADL, technology **bindings** per environment (which runtime, which store) and **acceptance scenarios** into an implementation handoff.
- **Continuum Diagram** draws pictures grounded in the compiled model, labelled with how much of each picture the model actually establishes.

The specifications, guides and worked examples are served by the Continuum MCP server; the agents read them as they work.

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
| Authoring workspaces | not durable: expire after 2 hours idle, and can be lost sooner on a server restart, scale-to-zero or eviction (more than 64 held). The agents keep every file on disk and re-create workspaces. |
| Other rate limits | not published. When a server refuses, the agents stop that line of work and report it. |

The coordinator imports one diagram snapshot per model revision and the agents reuse diagram runs to stay within the limits.

**Claude usage.** Claude Code usage is billed by Anthropic as usual. An intent-first conversation is usually one agent; a development-ready session is large: the coordinator may brief several specialists and reviewers, and each reads the shared skill and the Continuum guides it needs. For scale, each independent review run while maintaining this repository used 100–125 thousand tokens on its own. No full-session figure has been measured yet.

**Your data.** The Continuum servers are hosted by Avlon. Every Architect tool states that it is answered on hosted infrastructure from content supplied with the request or held in a hosted workspace, never read from your machine. What the agents send is therefore processed there: model and business documents, bindings, scenarios when checked, file paths and line ranges from your code, and any code an agent quotes. No privacy or data-retention policy for the preview is published with the servers or this repository; ask in your access issue before using a repository whose architecture you may not share with a third party.

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

Intent-first conversations need only the Continuum MCP server, plus the Diagram server when a picture helps. In development-ready mode the agents tell you at the start which route you are on, and they never claim a check that did not run. What each route can author, verify and leave unverified, artifact by artifact, is in the [skill's tool routes](.claude/skills/continuum-authoring/SKILL.md#3-tool-routes-mcp-first-cli-optional).

## Setup

1. **Connect the MCP servers** (once per machine; add `--scope project` to share them with your team through `.mcp.json`):

   ```sh
   claude mcp add --transport http continuum https://mcp.continuum.dev.avlon.ca/mcp
   claude mcp add --transport http continuum-diagram https://diagram.continuum.dev.avlon.ca/mcp
   ```

   Start Claude Code, run `/mcp`, choose each server and sign in in the browser window it opens (OAuth), with the account you were invited with. If sign-in or the first tool call fails, check that your invitation is active.

2. **Add the agents and skill to your project:**

   ```sh
   git clone https://github.com/avlon-technologies/continuum-authoring.git
   mkdir -p <your-project>/.claude
   cp -r continuum-authoring/.claude/agents continuum-authoring/.claude/skills <your-project>/.claude/
   ```

   To use them in every project instead, copy the two folders into `~/.claude/`. In Claude Code, `/agents` should list seven `continuum-*` agents.

3. **Permissions (optional).** Claude Code asks before each tool call. To approve the Continuum tools once for the project, add to `<your-project>/.claude/settings.json`:

   ```json
   {
     "permissions": {
       "allow": ["mcp__continuum", "mcp__continuum-diagram", "Bash(continuum:*)", "Bash(base64:*)"]
     }
   }
   ```

   - The names must match the server names you chose in step 1. If you connected the servers as claude.ai connectors instead, the prefixes are `mcp__claude_ai_Continuum_Architect` and `mcp__claude_ai_Continuum_Diagram`.
   - `curl` (saving diagram images from their signed links) is deliberately left out: a broad `curl` rule would allow any network call, so Claude Code asks each time.
   - File edits are still confirmed. The agents are instructed to write only under `continuum/`; that is an instruction, not an enforced limit. Only the researcher has a restricted tool list (read and web tools).

## Usage

From your project, start Claude Code **with the coordinator as the main session**:

```sh
claude --agent continuum-architect
```

This matters because Claude Code subagents cannot start other subagents. If you instead ask an ordinary session to "use the continuum-architect agent", it cannot delegate, and it will tell you so.

### Intent-first (default)

Describe the product or the change, for example:

> We want to let customers share a workspace with outside collaborators. Help me work out the architecture and record what we decide.

What happens:

1. The coordinator reads the repository and any existing `continuum/` model, then tells you its understanding and the few decisions it thinks matter (costly to reverse, crossing an ownership, trust or data boundary).
2. It asks only questions whose answers change the architecture, each with a recommended default, and pushes back on choices that look questionable, offering a simpler alternative. You decide.
3. It preserves what you agreed where it belongs: the ADL model (or an `.adl-change` to an existing one), BDL when business rules are the hard part, a binding for a consequential technology choice, decisions and principles in the Continuum decision space or `continuum/GOAL.md`, and a diagram when a picture helps. It compiles what it touches.
4. It classifies the important expectations as verifiable, indirectly testable or human judgment, and names the few worth verifying.
5. It stops once the architecture is clear enough to proceed, and writes a short `continuum/HANDOFF.md`, including the effort spent. It offers development-ready mode but does not start it.

**If your repository already has an adopted package** (a `continuum/ledger.json` with a current checkpoint), the conversation produces a *proposed change*, never an edit to what you adopted. The architecture goes in `continuum/model/changes/<name>.adl-change`, proven to apply to the adopted state. The decisions, rationale, open questions and verification opportunities go in `continuum/model/changes/<name>.proposal.md` beside it. `GOAL.md`, `HANDOFF.md`, the model, bindings and scenarios of the adopted package are left untouched, and its readiness claims keep holding for the adopted state. Adopting the change stays yours, through the existing transition lifecycle (`continuum icp init`, then `continuum icp ready`); a development-ready request on such a repository moves the proposal into that transition (its `REASON.md`, changed bindings and scenarios), checks it, and stops at your approval. It never adopts it.

### Development-ready (explicit request)

> Author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings for local development, acceptance scenarios, and Continuum diagrams. Do not implement the product. Show validation evidence and gaps.

What happens:

1. The coordinator checks which servers and tools are available, surveys the repository, and asks you a few high-value questions about user journeys, constraints and costly-to-reverse choices. It challenges assumptions and suggests what does not need modeling.
2. It authors the architecture **end to end** and invokes specialist agents only for targeted, independent challenges or clearly separable work. Specialists are not mandatory stages.
3. It shows you the diagrams, with their labels: a *provisional proposal* is for reaction; only a *verified* diagram is a deliverable.
4. A fresh reviewer challenges the first meaningful integrated draft before costly downstream work. A separate fresh reviewer challenges the final verified package as a developer would, identifying contradictions, vacuous tests and decisions it would still need to invent.
5. Everything lands in your repository's `continuum/` directory, ending with `continuum/HANDOFF.md`: the readiness level reached, a status and evidence table, open gaps and choices, the biggest blockers, the effort spent and a retrospective.

## The agents

| Agent | Role |
|---|---|
| [`continuum-architect`](.claude/agents/continuum-architect.md) | Primary architecture author and your only point of contact; runs the intent conversation, owns coherence and the handoff, and readiness in development-ready mode. |
| [`continuum-adl-author`](.claude/agents/continuum-adl-author.md) | The architecture model and changes to it. |
| [`continuum-bdl-author`](.claude/agents/continuum-bdl-author.md) | The business model, when the business rules are the hard part. |
| [`continuum-tech-author`](.claude/agents/continuum-tech-author.md) | Technology bindings per environment, evidenced from your repository. |
| [`continuum-acceptance-author`](.claude/agents/continuum-acceptance-author.md) | Executable Given/When/Then acceptance scenarios traced to the model. |
| [`continuum-diagram-author`](.claude/agents/continuum-diagram-author.md) | The final, consistent diagram set. |
| [`continuum-researcher`](.claude/agents/continuum-researcher.md) | Optional: dated external evidence for a consequential choice. |

Specialists are available on demand, not required production stages; in intent-first mode they are rarely needed. All of them follow one shared protocol, the [`continuum-authoring` skill](.claude/skills/continuum-authoring/SKILL.md): authority, communication, tool routes, file ownership, contracts, readiness levels and failure handling, each defined once. See also the [vision](VISION.md) and the [evaluation template](EXPERIMENT.md).

## Known limitations

- Binding validation, scenario validation, the evidence file, the package build and the lifecycle acts need the CLI, which is not public yet; MCP-only development-ready sessions stop at **Authored — package UNVERIFIED**.
- The guides' package layouts do not list the `.bdl` business model, so whether the package build includes it is unverified.
- `continuum_process_graph` refuses queries through MCP; the agents use `continuum_preview`, which returns the same causal traces from every entry message.
- Binding checks through a diagram import have not been exercised live yet (diagram quota).
- The Diagram server's snapshot limit can block new diagrams until older snapshots expire. A development-ready session whose final diagrams are blocked ends at **Partial**, with the planned views recorded so they can run later.
- The agents produce architecture, not code, and their judgments of quality and fitness are reasoning, not proof. Only the compilers' verdicts are proof, and only of legality.

## Maintaining this repository

Two kinds of check, kept apart:

- **Static** — `node tools/check.mjs`, run by CI on every push. No network. It checks that the agents, the skill and the README agree: agent names and tables, skill section references, guide section references, brief and return-contract fields, the ownership layout against each agent file, quoted limits, links and known-stale terms; and that every cited tool, knowledge URI and guide section is in `tools/surface.json`, a dated record of the live servers. It catches drift in names, references and numbers, not contradictions in meaning.
- **Live** — [`tools/LIVE-CHECKS.md`](tools/LIVE-CHECKS.md), run by a maintainer with both servers connected before each release: refresh the record, re-run the route probes, and re-read the guide sections the agents rely on. The static check warns when the record is more than 45 days old.

## License

[MIT](LICENSE)
