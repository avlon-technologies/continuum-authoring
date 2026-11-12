# Architecture-intent experiment

This experiment lives in **continuum-authoring**. Recall is the product test subject, not the experiment framework repository.

**Control:** original specification-completeness package in `avlon-technologies/ai-recall`, frozen at commit `e1caf64c6ec29b78c93102d12191e062d0eae6e7`.

**Treatment:** main Claude Code orchestrator acting as simulated human authority, collaborating with `.claude/agents/continuum-intent-author.md`. Read `experiment/RUNBOOK.md` and `experiment/QUALITY-RUBRIC.md`.

Goal: faithfully preserve architectural intent and enable independent understanding and evolution reasoning, without exhaustive specifications. Use the frozen Recall vision as the product baseline; do not expose the control architecture to the treatment author. Produce new artifacts under `experiment/runs/01/` and compare both arms under identical blind review tasks.

**Status:** setup prepared; experiment not run. Confirm local agent discovery and Continuum tool access before execution.
