# Phase 03: Results & Comparison - Context

**Gathered**: 2026-04-23
**Status**: Ready for planning

<domain>
## Phase Boundary

This phase delivers the final survey results and candidate comparison interface.

</domain>

<decisions>
## Implementation Decisions

### Scoring Integration
- **D-01**: Use the existing `calculateAlignment` from `src/lib/scoring.ts` to compute scores for all candidates in the active race.
- **D-02**: Compute results entirely client-side on page load for maximum privacy.

### Result Filtering
- **D-03**: Show only the **Top 3** candidates by alignment percentage to keep the interface focused (MVP constraint).
- **D-04**: Sort candidates by alignment descending; handle ties by party name alphabetical.

### Simple UI
- **D-05**: Use a simple list view for results initially.
- **D-06**: Each candidate card will show: Name, Party, Alignment %, and a CTA to "See Comparison".

</decisions>

<canonical_refs>
## Canonical References

### Project Core
- \`.planning/PROJECT.md\`
- \`.planning/REQUIREMENTS.md\`
- \`.planning/ROADMAP.md\`

### Logic & Data
- \`src/lib/scoring.ts\` — Algorithm source.
- \`src/lib/registry.ts\` — Data source.
- \`src/store/useSurveyStore.ts\` — State source.

</canonical_refs>

<code_context>
## Existing Code Insights

- `useSurveyStore` persists the `currentRaceId` and `responses`.
- `calculateAlignment` expects `UserResponse[]` and `CandidateStance[]`.

</code_context>

<specifics>
## Specific Ideas
- Use a "Match Meter" (simple progress bar or percentage) to visualize alignment.

</specifics>

---

*Phase: 03-results-comparison*
*Context gathered: 2026-04-23*
