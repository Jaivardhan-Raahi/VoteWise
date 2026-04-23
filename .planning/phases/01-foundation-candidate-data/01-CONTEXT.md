# Phase 01: Foundation & Candidate Data - Context

**Gathered**: 2026-04-23
**Status**: Ready for planning

<domain>
## Phase Boundary

This phase delivers the data foundation and core matching logic.

</domain>

<decisions>
## Implementation Decisions

### Data Strategy
- **D-01**: Use static JSON assets for candidate profiles and stances to ensure speed and data integrity.
- **D-02**: Every stance MUST include a verified source URL for transparency.

### Matching Logic
- **D-03**: Implement simple weighted sum scoring for alignment calculation.
- **D-04**: Use a 0–10 scale for both user stances and candidate positions.

### Content Depth
- **D-05**: Stances are stored as "Bite-sized" summaries (max 280 chars) to maintain minimalism.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Core
- \`.planning/PROJECT.md\` — High-level goals and constraints.
- \`.planning/REQUIREMENTS.md\` — Functional requirements for Phase 1.
- \`.planning/ROADMAP.md\` — Phase structure and success criteria.

### Research
- \`.planning/research/SUMMARY.md\` — Ecosystem synthesis.
- \`.planning/research/ARCHITECTURE.md\` — System structure and data flow.
- \`.planning/research/STACK.md\` — Recommended tech stack.

</canonical_refs>

<code_context>
## Existing Code Insights

- No existing code detected (Greenfield). 
- Follow Next.js 15 / React 19 patterns established in research.

</code_context>

<specifics>
## Specific Ideas
- Use a "Warm Civic" palette (Sandstone, Sage) for data visualization elements even in the foundation layer to ensure thematic alignment.

</specifics>

<deferred>
## Deferred Ideas
- Location input (ZIP/Address) — Deferred or optional for initial MVP to focus on core matching.
- Dynamic API integration (Google Civic) — Deferred to v2.
- Blind matching mode — Deferred to v2.

</deferred>

---

*Phase: 01-foundation-candidate-data*
*Context gathered: 2026-04-23*
