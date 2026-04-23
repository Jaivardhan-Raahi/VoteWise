# Phase 02: Survey Core - Context

**Gathered**: 2026-04-23
**Status**: Ready for planning

<domain>
## Phase Boundary

This phase implements the primary user interaction for capturing political stances: the multi-step survey. This includes the state management for survey progress, issue weighting, and local persistence.

</domain>

<decisions>
## Implementation Decisions

### Navigation Flow
- **D-01**: Use a linear "Step-by-Step" wizard flow for the survey to maintain focus.

### Stance UI
- **D-02**: Use a Slider component for the 0–10 scale to allow for nuanced but simple input.

### Weighting UX
- **D-03**: Implement a simple 3-tier weighting system (Low, Medium, High) represented as numbers (1, 2, 3) in the scoring calculation.

### Persistence
- **D-04**: Use Zustand's persist middleware to automatically sync survey state to \localStorage\.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Core
- \.planning/PROJECT.md\
- \.planning/REQUIREMENTS.md\
- \.planning/ROADMAP.md\
- \.planning/phases/01-foundation-candidate-data/01-CONTEXT.md\

### Phase 1 Outputs
- \src/types/schema.ts\ — Data types for Stances and Candidates.
- \src/lib/scoring.ts\ — Scoring engine logic to be used for real-time or final results.
- \src/lib/registry.ts\ — Data access for questions/stances.

</canonical_refs>

<code_context>
## Existing Code Insights
- \src/lib/scoring.ts\ is ready to accept user stance vectors.
- \src/types/schema.ts\ defines the 0-10 scale constraints.

</code_context>

<specifics>
## Specific Ideas
- The survey should show a clear progress indicator at the top to manage user expectations.

</specifics>

<deferred>
## Deferred Ideas
- Skip/N/A option for questions — Deferred to ensure full alignment data for MVP.
- Skip to specific category — Deferred to v2.

</deferred>

---

*Phase: 02-survey-core*
*Context gathered: 2026-04-23*
