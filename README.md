# Continuum Authoring

An integrated Claude Code architecture agent, supported by optional specialist advisers, that works with you to turn a product idea or an existing codebase into a **development-ready Continuum architecture**: a compiled architecture model, a business model where it helps, technology bindings, executable acceptance scenarios and grounded diagrams, ready to hand to a developer or a coding agent.

This repository is the authoring framework. It does not implement your product.

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

**Claude usage.** Claude Code usage is billed by Anthropic as usual, and a full session is large: the coordinator briefs several specialists, and each reads the shared skill and the Continuum guides it needs. For scale, each independent review run while maintaining this repository used 100–125 thousand tokens on its own. No full-session figure has been measured yet.

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
| Highest honest result | **Authored — package UNVERIFIED** | **Development-ready** |

The agents tell you at the start which route you are on, and they never claim a check that did not run. What each route can author, verify and leave unverified, artifact by artifact, is in the [skill's tool routes](.claude/skills/continuum-authoring/SKILL.md#3-tool-routes-mcp-first-cli-optional).

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

Then describe what you want, for example:

> Author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings for local development, acceptance scenarios, and Continuum diagrams. Do not implement the product. Show validation evidence and gaps.

What happens:

1. The coordinator checks which servers and tools are available, surveys the repository, and asks you a few high-value questions about user journeys, constraints and costly-to-reverse choices. It challenges assumptions and suggests what does not need modeling.
2. It authors the architecture **end to end** and invokes specialist agents only for targeted, independent challenges or clearly separable work. Specialists are not mandatory stages.
3. It shows you the diagrams, with their labels: a *provisional proposal* is for reaction; only a *verified* diagram is a deliverable.
4. A fresh reviewer challenges the first meaningful integrated draft before costly downstream work. A separate fresh reviewer challenges the final verified package as a developer would, identifying contradictions, vacuous tests and decisions it would still need to invent.
5. Everything lands in your repository's `continuum/` directory, ending with `continuum/HANDOFF.md`: the readiness level reached, a status and evidence table, open gaps and choices, the biggest blockers and a retrospective.

## The agents

| Agent | Role |
|---|---|
| [`continuum-architect`](.claude/agents/continuum-architect.md) | Primary end-to-end architecture author and your only point of contact; owns coherence, readiness and the handoff. |
| [`continuum-adl-author`](.claude/agents/continuum-adl-author.md) | The architecture model and changes to it. |
| [`continuum-bdl-author`](.claude/agents/continuum-bdl-author.md) | The business model, when the business rules are the hard part. |
| [`continuum-tech-author`](.claude/agents/continuum-tech-author.md) | Technology bindings per environment, evidenced from your repository. |
| [`continuum-acceptance-author`](.claude/agents/continuum-acceptance-author.md) | Executable Given/When/Then acceptance scenarios traced to the model. |
| [`continuum-diagram-author`](.claude/agents/continuum-diagram-author.md) | The final, consistent diagram set. |
| [`continuum-researcher`](.claude/agents/continuum-researcher.md) | Optional: dated external evidence for a consequential choice. |

Specialists are available on demand, not required production stages. All of them follow one shared protocol, the [`continuum-authoring` skill](.claude/skills/continuum-authoring/SKILL.md): authority, communication, tool routes, file ownership, contracts, readiness levels and failure handling, each defined once. See also the [vision](VISION.md) and the [evaluation template](EXPERIMENT.md).

## Known limitations

- Binding validation, scenario validation, the evidence file, the package build and the lifecycle acts need the CLI, which is not public yet; MCP-only sessions stop at **Authored — package UNVERIFIED**.
- The guides' package layouts do not list the `.bdl` business model, so whether the package build includes it is unverified.
- `continuum_process_graph` refuses queries through MCP; the agents use `continuum_preview`, which returns the same causal traces from every entry message.
- Binding checks through a diagram import have not been exercised live yet (diagram quota).
- The Diagram server's snapshot limit can block new diagrams until older snapshots expire. A session whose final diagrams are blocked ends at **Partial**, with the planned views recorded so they can run later.
- The agents produce architecture, not code, and their judgments of quality and fitness are reasoning, not proof. Only the compilers' verdicts are proof, and only of legality.

## Maintaining this repository

Two kinds of check, kept apart:

- **Static** — `node tools/check.mjs`, run by CI on every push. No network. It checks that the agents, the skill and the README agree: agent names and tables, skill section references, guide section references, brief and return-contract fields, the ownership layout against each agent file, quoted limits, links and known-stale terms; and that every cited tool, knowledge URI and guide section is in `tools/surface.json`, a dated record of the live servers. It catches drift in names, references and numbers, not contradictions in meaning.
- **Live** — [`tools/LIVE-CHECKS.md`](tools/LIVE-CHECKS.md), run by a maintainer with both servers connected before each release: refresh the record, re-run the route probes, and re-read the guide sections the agents rely on. The static check warns when the record is more than 45 days old.

## License

[MIT](LICENSE)
