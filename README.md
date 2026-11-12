# Continuum Authoring

Claude Code agents that work with you to turn a product idea or an existing codebase into a **development-ready Continuum architecture**: a compiled architecture model, a business model where it helps, technology bindings, executable acceptance scenarios and grounded diagrams, ready to hand to a developer or a coding agent.

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
| **Continuum access** | both MCP servers | access is **by invitation** during the preview: [open an issue titled "Access request"](https://github.com/avlon-technologies/continuum-authoring/issues/new?title=Access%20request) |
| Continuum MCP server | authoring and compiling ADL and BDL, knowledge | `https://mcp.continuum.dev.avlon.ca/mcp` |
| Continuum Diagram server | diagrams | `https://diagram.continuum.dev.avlon.ca/mcp` |
| `continuum` CLI (optional) | building and checking the development package | not publicly distributed yet |

Despite the `dev` in their names, these hostnames are the production preview service.

**Cost.** Continuum is a free preview. Usage is rate-limited: notably, the Diagram server keeps at most 16 live model snapshots per account, with no delete; each expires after 24 hours. The coordinator imports one snapshot per model revision and the agents reuse diagram runs to stay within the limit.

**Your data.** The Continuum servers are hosted by Avlon. Whatever the agents send to them is processed there: model and business documents, bindings, and architecture recovered from your code (file paths and line ranges, and any code an agent quotes). Workspaces and snapshots are temporary. Do not use the servers for a repository whose architecture you may not share with a third party. Claude Code usage is billed by Anthropic as usual.

### What you get with and without the CLI

The MCP servers handle authoring, compiling, querying and change-proving for ADL and BDL, plus diagrams. Three things exist only in the CLI today: validating bindings, validating scenarios, and building and checking the package.

| | MCP only (public default) | MCP + CLI |
|---|---|---|
| ADL model, compiled and attested | yes | yes |
| Architecture changes proved (`apply(A, Δ) = B`) | yes | yes |
| BDL model, compiled | yes | yes |
| Diagrams | yes | yes |
| Bindings and scenarios | drafted; references checked one by one; **UNVERIFIED** | validated by the package build |
| Development package built and checked | no | yes |
| Highest honest result | **Authored — package UNVERIFIED** | **Development-ready** |

The agents tell you at the start which route you are on, and they never claim a check that did not run. The details are in the [skill's tool-route table](.claude/skills/continuum-authoring/SKILL.md#3-tool-routes-mcp-first-cli-optional).

## Setup

1. **Connect the MCP servers** (once per machine; add `--scope project` to share them with your team through `.mcp.json`):

   ```sh
   claude mcp add --transport http continuum https://mcp.continuum.dev.avlon.ca/mcp
   claude mcp add --transport http continuum-diagram https://diagram.continuum.dev.avlon.ca/mcp
   ```

   Start Claude Code, run `/mcp`, choose each server and sign in in the browser window it opens (OAuth), with the account you were invited with. Until your invitation is active, sign-in or the first tool call is refused.

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
       "allow": ["mcp__continuum", "mcp__continuum-diagram", "Bash(continuum:*)", "Bash(base64:*)", "Bash(curl:*)"]
     }
   }
   ```

   The server names must match the names you used in step 1. `curl` saves diagram images from their signed links. File edits are still confirmed. The agents are instructed to write only under `continuum/`, but that is an instruction, not an enforced limit; only the researcher has a restricted tool list (read and web tools).

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
2. It briefs the specialists (ADL, BDL, bindings, scenarios, diagrams, and research only when outside evidence would change a decision) and relays their findings and questions to you. The specialists never talk to you directly.
3. It shows you the diagrams, with their labels: a *provisional proposal* is for reaction; only a *verified* diagram is a deliverable.
4. A fresh agent that wrote none of it reviews the result as a developer would and names the decisions it would still have to invent.
5. Everything lands in your repository's `continuum/` directory, ending with `continuum/HANDOFF.md`: the readiness level reached, a status and evidence table, open gaps and choices, the biggest blockers and a retrospective.

## The agents

| Agent | Role |
|---|---|
| [`continuum-architect`](.claude/agents/continuum-architect.md) | Coordinator and your only point of contact; owns the goal, readiness and the handoff. |
| [`continuum-adl-author`](.claude/agents/continuum-adl-author.md) | The architecture model and changes to it. |
| [`continuum-bdl-author`](.claude/agents/continuum-bdl-author.md) | The business model, when the business rules are the hard part. |
| [`continuum-tech-author`](.claude/agents/continuum-tech-author.md) | Technology bindings per environment, evidenced from your repository. |
| [`continuum-acceptance-author`](.claude/agents/continuum-acceptance-author.md) | Executable Given/When/Then acceptance scenarios traced to the model. |
| [`continuum-diagram-author`](.claude/agents/continuum-diagram-author.md) | The final, consistent diagram set. |
| [`continuum-researcher`](.claude/agents/continuum-researcher.md) | Optional: dated external evidence for a consequential choice. |

All of them follow one shared protocol, the [`continuum-authoring` skill](.claude/skills/continuum-authoring/SKILL.md): authority, communication, tool routes, file ownership, contracts, readiness levels and failure handling, each defined once. See also the [vision](VISION.md) and the [evaluation template](EXPERIMENT.md).

## Known limitations

- Binding validation, scenario validation and the package build need the CLI, which is not public yet; MCP-only sessions stop at **Authored — package UNVERIFIED**.
- The Diagram server's snapshot limit (16 live per account, no delete, 24-hour expiry) can block new diagrams until older snapshots expire; the agents report this and record the planned views.
- MCP workspaces are temporary; the agents keep files on disk as the source of truth and re-create a workspace when it expires.
- The agents produce architecture, not code, and their judgments of quality and fitness are reasoning, not proof. Only the compilers' verdicts are proof, and only of legality.

## Maintaining this repository

`node tools/check.mjs` checks that the agents, the skill and the README agree: agent names and tables, section references, return-contract fields, links, and known-stale terms. It also checks every Continuum tool name and knowledge URI cited against `tools/surface.json`, a snapshot of the live servers. CI runs it on every push. It cannot see the live servers, so before each release refresh that snapshot against them (instructions in the file) and update its `verified` date. The checks catch renamed or removed references, not contradictions in meaning; review those by reading.

## License

[MIT](LICENSE)
