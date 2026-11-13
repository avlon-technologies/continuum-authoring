# Continuum Authoring — Intent-First Direction (Proposal)

Status: **PROPOSED** · 2026-11-13

## Mission

Help a human or AI collaborator **discover, articulate, preserve, and evolve consequential architectural intent**. Produce coherent Continuum artifacts where they preserve meaning, support communication, guide implementation, or enable evidence-based verification. **Artifact volume and development-ready packaging are not success metrics by themselves.**

This is a proposed change in direction, not a claim that the current agents implement it.

## Why change?

The earlier development-ready authoring workflow could take more than 90 minutes where direct implementation took about 10 minutes, without demonstrably improving the product. Later architecture-verification experiments demonstrated that a small number of well-chosen invariants (including mutation authority and account isolation) can catch meaningful defects missed by ordinary application tests. Those verifiers required substantial earlier engineering investment; the final short experiments reused that work. Do not mistake extraction time for total development cost.

The conclusion is **not** that documentation is unnecessary or that every intent deserves an executable verifier. The conclusion is that architectural reasoning should prioritize consequential decisions and evidence of value over exhaustive pre-implementation production.

## Operating principles

1. **Conversation before ceremony.** Understand the intended outcome, boundaries, tradeoffs, and what would be costly to reverse. Ask only questions that materially affect a decision.
2. **Preserve what matters.** Record decisions, ownership, contracts, behavioral expectations, assumptions, and rationale that future changes must not silently erase.
3. **Artifacts serve intent.** ADL, BDL, technology bindings, ADRs, principles, and diagrams remain first-class. Choose and update the artifacts that carry the relevant meaning; do not generate every artifact by default.
4. **Sufficiency is contextual.** An exploratory design may be ready for implementation while some decisions remain open. A requested development-ready handoff must still meet explicit completeness and consistency criteria. Never silently downgrade that request.
5. **Separate claims.** Distinguish modeled intent, compiled model validity, verified implementation behavior, unverified expectations, and human judgments. Compilation is not implementation verification.
6. **Verification is selective.** Identify high-consequence, testable invariants and suggest appropriate evidence. Do not generate a verifier for every rule or imply adversarial tamper resistance. Current CLI verification assumes cooperative assessed code.
7. **Evolve incrementally.** On change, identify affected intent and update only the necessary artifacts, preserving provenance and noting unresolved conflicts.
8. **Bound the investment.** Measure cumulative authoring effort and developer benefit, not just individual agent durations. Stop when additional artifact production has no demonstrated marginal value.

## Proposed interaction

**Discover → Decide → Preserve → Connect to evidence → Evolve**

- **Discover:** Understand the change or idea and read existing code/model when present.
- **Decide:** Surface consequential ambiguities; offer a recommendation and obtain human/orchestrator decisions where authority matters.
- **Preserve:** Express the resulting intent in the appropriate Continuum artifacts. Maintain cross-artifact consistency without exhaustive elaboration.
- **Connect to evidence:** Classify expectations as directly verifiable, indirectly testable, or requiring human judgment. Name gaps without fabricating proof.
- **Evolve:** When implementation or understanding changes, revisit affected decisions and artifacts rather than restarting the whole package.

The authoring agent does **not** own verification verdicts. Continuum verification evaluates declared checks; its evidence and trust model must be reported separately.

## A useful session outcome

A concise handoff should answer:

- What architectural intent did we learn or change?
- Which decisions and constraints matter, and why?
- Where is that intent preserved (ADL/BDL/bindings/ADRs/principles/diagrams)?
- What can be checked, what evidence exists, and what remains unverified?
- What can implementation safely proceed with, and what decision is genuinely blocking?
- How much time was spent, and what value did the work add?

Do not automatically require a full development package, independent review, all diagrams, or all specialists. Invoke them when the request, risk, or evidence warrants them.

## Responsibilities

| Concern | Primary responsibility |
| --- | --- |
| Discover intent, ask questions, capture decisions and rationale | Authoring coordinator, with human/orchestrator authority |
| Represent architecture/business/technology intent | Continuum models and associated artifacts |
| Check model validity and consistency | Continuum compiler and model tooling |
| Evaluate declared expectations against implementation | Continuum verification and other tests |
| Approve tradeoffs, risk acceptance, and consequential decisions | Authorized human/orchestrator |

## Proposed smallest next change

After reviewing this proposal, revise **only** the coordinator's entry instructions and its shared skill to support an explicit **intent-first** default, while retaining an opt-in **development-ready** mode. Do not rewrite seven specialist agents at once.

Validate the change on **one real architecture conversation**, comparing the resulting preserved decisions, clarity, elapsed time, and usefulness to implementation/evolution. Do not assume a better result until observed.

## Non-goals

- Replacing developers or the implementation agent.
- Exhaustive documentation before any coding.
- Automatic verifier generation for every architectural statement.
- A new governance or approval framework.
- Claims that architecture verification resists malicious code.
- Repeating the earlier 90-minute authoring workflow by default.
