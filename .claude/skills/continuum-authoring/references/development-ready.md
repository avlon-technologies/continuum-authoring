# Continuum authoring: development-ready mode

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 8. Development-ready mode: protocol and readiness

This section applies **only** when development-ready output was explicitly requested (`intent-first.md` §5). It then applies in full and is not reduced to fit time or tooling: a row that cannot be met makes the result Partial. Intent-first sessions claim no readiness level.

At the start, check the Diagram server (`diagram_models`) and the CLI (`continuum --version`), and tell the human what the route can and cannot verify and the highest readiness level reachable (`authority-and-tools.md` §2).

1. **Discover and challenge** (`intent-first.md` §5 steps 1–3, plus: 2–3 representative journeys and one critical exception, what must be observable, every Environment the system needs, and the 1–3 unknowns that could change significant architecture). Write the intent record with stated versus inferred assumptions, material trade-offs and what not to model.
2. **Draft as one coherent design**: Goal, representative BDL behaviours, thin compiling ADL and early counterexample scenarios together (`artifacts.md` §6). Before changing semantics, simulate a representative journey and its adverse counterpart across all of them. Every normative behaviour a scenario needs must exist in the ADL or BDL; Goal-only rules are not enough.
3. **Baseline and package.** When material semantics are settled, complete bindings for every declared Environment, the full scenario set and the final diagram set (`diagrams.md` §7). Delay pins and diagram imports until then; if an authored semantic artifact changes afterwards, mark dependents stale, update them as one batch, and repin, rebuild and reimport once. Without an adopted package, write `development-package.json` (`continuum://guides/package-formats` §1: `development-package: "1"`, kebab-case `name`, explicit `environment`, `controls` only as labelled recommended defaults; in change mode, once the human agrees, `semantic.change`). With the CLI: `continuum package build continuum`, then `continuum package check` (the build writes in place and has no `--out`; on an adopted package the change is built by its transition instead, below).
4. **Independent developer review.** Brief one fresh, read-only `general-purpose` subagent that has not seen your reasoning, with the intent record and the `continuum/` package (or the transition) only: explain the key journeys as a developer would, then name the top three decisions it would still have to invent, contradictions between artifacts, scenarios that prove nothing, and Environments left unverified; edit nothing. Reconcile major findings in one batch. One further review is justified only after substantial changes. If no subagent can run, label SELF-REVIEW; the result is then Partial.
5. **Report** every artifact as PASS / PARTIAL / BLOCKED / NOT CHECKED with its evidence.

**Cross-artifact consistency** (apply before the baseline and in review):

| Comparison | Falsification question |
|---|---|
| Goal ↔ ADL/BDL | Is any scenario-required rule only written in GOAL.md? Are precedence and refusal rules actually declared? |
| ADL ↔ BDL | Can lifecycle transitions, retroactive actions and exceptions coexist? |
| ADL ↔ bindings | Can the selected runtime, persistence and key/secret policy actually implement the required behaviour? |
| ADL/BDL ↔ scenarios | Is the behaviour normative, and would the scenario fail on a realistic incorrect implementation? |
| Bindings ↔ scenarios | Do expiry boundaries, retired credentials, replay/idempotency and concurrency agree? |
| Environments ↔ handoff | Have all Environments been checked, or are some explicitly unverified despite a primary-environment PASS? |

**On an adopted package** (`package-and-lifecycle.md` §4), development-ready work makes the *proposed* next package ready for the human's lifecycle decision, never current. The transition is its home:
1. **Decide the dimensions before `init`.** From the proven change and its apply report: acceptance is *changed* when the change adds or modifies a `Test` element or any scenario must be added, changed or removed; bindings are *changed* when a bound element or Environment is added, removed or re-bound. Then, with the human's agreement (`authority-and-tools.md` §1 authority 2), scaffold: `continuum icp init continuum/transitions/<name> --base continuum --reason "<one line>" --semantic changed`, plus `--bindings changed` / `--acceptance changed` as decided. `icp init` refuses a transition that changes no dimension, and a directory that already holds one.
2. **Copy, do not move yet.** Copy the proven `.adl-change` into `transitions/<name>/changes/` and set `semantic.change` in its `incremental-change-package.json`. **Append** the proposal record's content (decisions, rationale, open questions, verification classification, gaps, any proposed `.bdl` text, the diagram list) to `transitions/<name>/REASON.md` below the text `icp init` generated, keeping that text and its footer. The transition is content-addressed: finish `REASON.md` and every other file in it before the first `icp check`, because any later edit is refused as `lifecycle/identity/transition-id-mismatch`.
3. Author changed bindings under `transitions/<name>/bindings/` and added or changed scenarios under `transitions/<name>/acceptance/scenarios/`, with the base package's file names, and list them, and any removed scenarios, in the transition's `incremental-change-package.json` as `icp init` directs. Never edit the adopted ones.
4. Run `continuum icp check continuum/transitions/<name>` until it reports `applies`. If it refuses, do not re-`init` that directory and never run `icp delete`: scaffold one new directory with the corrected dimensions and rebuild it from the `model/changes/` originals by steps 2–3 (never copy the failed directory), and leave the failed transition for the human to dispose of (`authority-and-tools.md` §1 authority 3). Re-scaffold at most once; on a second refusal, or one dimensions cannot fix (such as base drift), stop and report the exact diagnostic. Only when a transition passes, replace the originals with a one-line pointer to it in `<name>.proposal.md` and delete the `model/changes/` copy of the `.adl-change`. Then read `continuum icp ready <transition> --no-execute`, perform only the steps before approval whose actor is `agent` (`icp materialize --analysis`), stop when the awaited actor is `human`, and give that one command.
5. Claim the readiness table for the proposed state, labelled *proposed, not adopted*: the Goal row by `REASON.md`; the ADL row by apply → B; the Bindings, Scenarios and Package rows by the verdicts of `icp check` and `icp materialize --analysis`, never by an in-place build; the BDL row as not applicable, or Partial with a gap when the change needs BDL; the Diagrams row on a snapshot imported from the analysed `result/`, with files in `model/changes/<name>.diagrams/`; the Review row by step 4 over the transition. The handoff goes in `model/changes/<name>.handoff.md`, and says that `GOAL.md` is carried unchanged into the next package, so after adoption `REASON.md` is where this change's intent lives.

**Readiness levels** — the single definition of done. A level is claimed only when every row holds with the stated evidence.

| | **Development-ready** (needs the CLI) | **Authored — package UNVERIFIED** (MCP-only ceiling) |
|---|---|---|
| Goal | `GOAL.md` per `intent-first.md` §5 (on an adopted package, the transition's `REASON.md`), agreements recorded (`authority-and-tools.md` §1 authority 2) | same |
| ADL | compiled and attested, 0 errors; in change mode apply → B proven | same |
| BDL | compiled, or recorded as not applicable with the reason | same |
| Bindings | every Environment the model declares is bound; the build reports each complete | drafted for every declared Environment, pinned to the current attestation, every `ref` confirmed by query; completeness NOT CHECKED |
| Scenarios | the build resolves every reference; its coverage report shows no uncovered Requirement or Test without a recorded reason | every reference confirmed by query; Test coverage computed by hand and labelled so |
| Package | `continuum package build` and `check` pass | not built; the handoff names who must build it |
| Diagrams | the final set is `verified-editable` on the current snapshot | same |
| Review | the independent review (step 4) found no unresolved major contradiction or missing consequential decision | same |

Anything less is **Partial**, with each missing piece named.

**Handoff** (`continuum/HANDOFF.md`, or on an adopted package `model/changes/<name>.handoff.md`; also your final message): the readiness level and, per row, the evidence or what is missing; a table of artifact, status, evidence (tool and verdict) and path; open gaps, the human's agreements with dates, open choices with recommended defaults and the three biggest blockers; the diagram set with labels, paths and links; recover mode: the citations per element; the review's provenance and findings (or SELF-REVIEW); what the next person must do with the CLI when this session had none; the cumulative effort and a candid retrospective.

**Progress for long runs.** When you run in the background, keep `.claude/progress/STATUS.md` (outside the package; repositories should ignore `.claude/progress/`) current at each phase change, verdict, question or blocker, and at least every 10 minutes: goal, run id, state (RUNNING, WAITING ON HUMAN, BLOCKED, DONE), what is happening now, proven verdicts (only checks that ran), claimed but unchecked work, blockers with exact error text, questions with defaults, and the next steps. Never report a check as passing before it ran.
