# Control baseline — original specification-completeness run

**Source repository:** avlon-technologies/ai-recall
**Frozen source commit:** `e1caf64c6ec29b78c93102d12191e062d0eae6e7`
**Source branch at freeze:** `main`
**Status:** IDENTIFIED; evaluation packet not yet assembled.

This is the original agent-authored Recall package. It is the existing control, not a newly created or revised control.

Known artifacts to inspect at the frozen commit:
- `VISION.md` (shared vision baseline; verify exact SHA when constructing packets)
- `continuum/model/ai-recall.adl` and `continuum/model/ai-recall.adl.txt`
- `continuum/model/*.adl-binding.json`
- `continuum/BEHAVIOUR.md`
- `docs/architecture/decisions/` (originally 22 proposed decisions)
- Principles: verify presence and format; mark missing if absent.

Original run reportedly included 74 acceptance scenarios, 104 product criteria, 27 UX screens, a 2,944-line implementation document, and roughly two hours of authoring. These are contextual observations, NOT independently verified measurements or quality scores. Do not substitute them for measured values.

Before evaluation: verify the commit, enumerate exact architecture artifact files and confirm whether the vision matches treatment's baseline. Construct a masked control packet without using implementation/UX prose to repair gaps in the architectural artifacts. Preserve the original source unchanged.

**Control product repo:** https://github.com/avlon-technologies/ai-recall
