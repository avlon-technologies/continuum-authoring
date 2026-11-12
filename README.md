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
| [`continuum-diagram-author`](.claude/agents/continuum-diagram-author.md) | Owns the final diagram set: accuracy, cross-view consistency, communication. |
| [`continuum-authoring` skill](.claude/skills/continuum-authoring/SKILL.md) | The shared authoring protocol and Diagram procedure every agent follows. |

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

   You can also open this repository directly in Claude Code to try it out. Run `/agents` to confirm the five agents are listed.

## Usage

In Claude Code, from your project:

> Use the continuum-architect agent to author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings, acceptance scenarios, and Continuum exploratory/polished diagrams. Do not implement the product. Show validation evidence, gaps, and an honest agent-experience retrospective.

Expect the coordinator to ask about consequential trade-offs, not every detail. It closes with an artifact/status/evidence/gaps table, the open choices, the three biggest blockers and a retrospective.

Diagram runs on the Continuum Diagram server are metered work, so the agents reuse and revise runs instead of re-rendering.

## Diagram ownership

Every authoring agent can use Continuum Diagram for fast exploratory feedback. The [Diagram Agent](.claude/agents/continuum-diagram-author.md) owns the **final diagram set**: it checks that the views agree with one another, cover the development-significant questions, communicate clearly to their intended audience and stay grounded in a pinned ADL model. Gaps go back to the relevant author rather than being invented in a picture. The coordinator keeps overall responsibility for development readiness.

## Completion

Compilation is necessary, **not sufficient**. Development-ready requires a coherent goal, compiled ADL, compiled BDL when applicable, valid technology bindings, executable acceptance scenarios, native Continuum diagrams and a verified development package where CLI support is available. If a check cannot run, the artifact is marked **UNVERIFIED** and full readiness is not claimed.

## License

[MIT](LICENSE)
