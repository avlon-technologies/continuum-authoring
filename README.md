# Continuum Authoring

Claude Code agents and a shared authoring skill for collaborating with a human to create **development-ready Continuum architecture**: ADL, relevant BDL, technology bindings, acceptance scenarios and Continuum diagrams.

## Getting started

Open this repository in Claude Code (or copy its `.claude/` resources into a target project that has Continuum tools configured). Ask:

> Use the continuum-architect agent to author the architecture for this project to development-ready: ADL, relevant BDL, technology bindings, acceptance scenarios, and Continuum exploratory/polished diagrams. Do not implement the product. Show validation evidence, gaps, and an honest agent-experience retrospective.

The primary coordinator is [continuum-architect](.claude/agents/continuum-architect.md), with [ADL](.claude/agents/continuum-adl-author.md), [BDL](.claude/agents/continuum-bdl-author.md) and [technology](.claude/agents/continuum-tech-author.md) specialist definitions. See the [authoring skill](.claude/skills/continuum-authoring/SKILL.md), [vision](VISION.md) and [single-session experiment](EXPERIMENT.md).

## Prerequisites

Claude Code with project subagents, access to the target repository and configured Continuum MCP/CLI tooling. These files do not themselves install Continuum. The agent should discover real tool availability and report missing capabilities.

## Completion

Compilation is necessary, **not sufficient**: require a coherent goal, compiled ADL, compiled BDL when applicable, valid technology bindings, executable acceptance scenarios, native Continuum diagrams and a verified development package where CLI support is available. If a check cannot run, mark the artifact **UNVERIFIED** and avoid claiming full readiness.

This project is the authoring framework, not an example app and not an implementation agent.
