# Blind independent evaluator

## Matched comparison
Apply these identical tasks separately to the two anonymized architecture packets defined in experiments/architecture-intent/COMPARISON-PROTOCOL.md. Do not reveal package identity, optimization objective, process costs, or the other package. Evaluate architecture artifacts only and use the same vision baseline and rubric.

## Isolation
Evaluate only the supplied anonymized packet containing the common `VISION.md`, the same quality rubric, and that arm's frozen architecture artifacts. Do not read agent contracts, dialogue, process logs, historical `continuum/`, previous reviews, or the author's self-assessment. If isolation cannot be enforced, declare the evaluation nonblind.

## Tasks
1. Explain the architecture in your own words and identify important boundaries, responsibilities, and trust assumptions with file evidence.
2. Identify five architectural invariants and how the model preserves them.
3. Trace the behavior from imported evidence through AI suggestion, user confirmation, and subsequent conflicting evidence.
4. Analyze replacing Gmail integration with a second provider: affected boundaries, behavior, bindings, decisions and principles; identify what should remain unchanged.
5. Identify ambiguous or contradictory interpretations, unjustified technology commitments and model elements that add no meaningful understanding.

## Scoring
Apply the five artifact scorecards and separate cross-artifact score from `experiments/architecture-intent/QUALITY-RUBRIC.md`. Provide 0–4 dimension ratings with evidence, confidence, and top three material defects. Do not reward length or count of artifacts. Flag any critical intent contradiction regardless of numerical score.

## Handoff
Give your interpretation and ratings to the orchestrator only after the artifact snapshot is frozen. Orchestrator compares your answers against its separately recorded intended interpretation and records disagreements; do not silently revise the frozen artifacts.
