# Claude Code — architecture intent experiment

This branch is a controlled experiment. Follow `experiment/RUNBOOK.md` and `experiment/QUALITY-RUBRIC.md`, not the original development-ready authoring workflow.

You are the **orchestrator** (simulated human authority). Delegate architecture authoring to the single project subagent `continuum-intent-author`. The old completeness-oriented agents have been removed from this branch. Do not recreate or invoke them.

Use the frozen Recall vision as the only product input. Keep control architecture and previous review results out of the treatment context. Record decisions with provenance and report meaningful progress. Write treatment artifacts only under `experiment/runs/01/`.

Optimize for faithful shared understanding, semantic consistency, consequential architectural meaning, evolution reasoning and economy. Do not build the application, expand the scope into exhaustive implementation specs, or claim a tool check establishes intent quality.

For comparisons, use the same blind rubric on both frozen arms after treatment completion. Simulated decisions do not constitute actual user authorization for deployments, merges or production changes.
