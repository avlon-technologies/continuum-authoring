# Continuum Authoring

Claude Code agents and a shared authoring skill for working with a human to create **development-ready Continuum architecture**: ADL (architecture), BDL (business model) where relevant, technology bindings, acceptance scenarios and Continuum diagrams.

This repository is the authoring framework. It is not an example app, and it does not implement your product.

## What's in it

| File | Role |
|---|---|
| [`continuum-architect`](.claude/agents/continuum-architect.md) | Coordinator. Works with you on goals and consequential decisions, delegates to the specialists, owns overall readiness. |
| [`continuum-adl-author`](.claude/agents/continuum-adl-author.md) | ADL: components, interfaces, dependencies, flows. |
| [`continuum-bdl-author`](.claude/agents/continuum-bdl-author.md) | BDL: business entities, use cases, workflows, exceptions. |
| [`continuum-tech-author`](.claude/agents/continuum-tech-author.md) | Technology bindings, environments, security, deployment. |
| [`continuum-acceptance-author`](.claude/agents/continuum-acceptance-author.md) | Executable Given/When/Then acceptance scenarios traced to the model. |
| [`continuum-diagram-author`](.claude/agents/continuum-diagram-author.md) | Owns the final diagram set: accuracy, cross-view consistency, communication. |
| [`continuum-researcher`](.claude/agents/continuum-researcher.md) | On-demand research and comparison of consequential architecture alternatives. |
| [`continuum-authoring` skill](.claude/skills/continuum-authoring/SKILL.md) | What every agent reads first: package layout and file ownership, brief/return contracts, where Continuum's documentation lives, failure playbook, Diagram procedure. |

See also the [vision](VISION.md) and a [pilot template](EXPERIMENT.md) for evaluating a session.

## Prerequisites

- [Claude Code](https://claude.com/claude-code).
- The two Continuum MCP servers (below). They are public and use OAuth sign-in.
- Optional: the `continuum` CLI, which is needed to build and check a development package (`continuum package realize/build/check`). It is not yet publicly distributed. Without it, the agents still author and compile models over MCP, but they mark package-level results **UNVERIFIED** instead of claiming readiness.

## Setup

1. **Connect the MCP servers** (once per machine; use `--scope project` instead to share the config with your team through `.mcp.json`):

   ```sh
   claude mcp add --transport http continuum https://mcp.continuum.dev.avlon.ca/mcp
   claude mcp add --transport http continuum-diagram https://diagram.continuum.dev.avlon.ca/mcp
   ```

   Then run `/mcp` inside Claude Code and sign in to each server when prompted.

2. **Add the agents and skill to your project.** Copy this repository's `.claude/agents/` and `.claude/skills/` folders into the root of the repository you want to architect, merging them with any existing `.claude/` folder:

   ```sh
   git clone https://github.com/avlon-technologies/continuum-authoring.git
   cp -r continuum-authoring/.claude/agents continuum-authoring/.claude/skills <your-project>/.claude/
   ```

   You can also open this repository directly in Claude Code to try it out. Run `/agents` to confirm the seven agents are listed.

## Usage

Start Claude Code **with the coordinator as the main session**, from your project:

```sh
claude --agent continuum-architect
```

This matters: Claude Code subagents cannot start other subagents. If you instead ask a normal session to "use the continuum-architect agent", it runs as a subagent and cannot delegate to the specialists (it will tell you, and fall back to doing their work itself).

Then describe what you want, for example:

> Author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings for local development, acceptance scenarios, and Continuum diagrams. Do not implement the product. Show validation evidence, gaps, and an honest agent-experience retrospective.

The coordinator checks tools, discovers user journeys and consequential assumptions, challenges material alternatives, then briefs the specialists. It invokes the researcher only when external evidence is worth gathering. Work lands in your repository's `continuum/` directory, with one owner per file (see the [skill](.claude/skills/continuum-authoring/SKILL.md#4-package-layout-and-ownership)). It closes with `continuum/HANDOFF.md`: an artifact/status/evidence table, open gaps and choices, the three biggest blockers and a retrospective.

The agents read Continuum's specifications, guides and worked examples from the MCP server as they go, so they track the current language rather than a copy in this repository.

Diagram runs on the Continuum Diagram server are metered work, so the agents reuse and revise runs instead of re-rendering.

## Diagram ownership

Every authoring agent can use Continuum Diagram for fast exploratory feedback. The [Diagram Agent](.claude/agents/continuum-diagram-author.md) owns the **final diagram set**: it checks that the views agree with one another, cover the development-significant questions, communicate clearly to their intended audience and stay grounded in a pinned ADL model. Gaps go back to the relevant author rather than being invented in a picture. The coordinator keeps overall responsibility for development readiness.

## Independent review and proportional modeling

The coordinator requests a fresh-context developer-readiness review of the deliverable: can another agent explain the system and implement the user journeys without inventing major decisions? Record the top three gaps, route them to owners, and label reviews SELF-REVIEW when independent context is unavailable. Tool validity, architecture quality, and fitness are different claims. Only author additional BDL, views, or governance artifacts when their value is justified.

## Completion

Compilation is necessary, **not sufficient**. Development-ready requires a coherent goal, compiled ADL, compiled BDL when applicable, valid technology bindings, executable acceptance scenarios, native Continuum diagrams and a verified development package where CLI support is available. If a check cannot run, the artifact is marked **UNVERIFIED** and full readiness is not claimed.

## License

[MIT](LICENSE)
