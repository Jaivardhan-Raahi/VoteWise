# Phase 04: Warm Civic UI - Context

**Gathered**: 2026-04-23
**Status**: Ready for planning

<domain>
## Phase Boundary

This phase delivers the visual identity of the application, including the landing page and global style refinements.

</domain>

<decisions>
## Implementation Decisions

### Aesthetic Strategy
- **D-01**: "Warm Civic" palette: Use Zinc-50 for backgrounds (paper-like), Zinc-900 for primary text, and subtle Sage/Slate accents for CTAs.
- **D-02**: Typography: Use `Public Sans` (standard in civic design) via Google Fonts or system fallbacks.

### Landing Page (Hero)
- **D-03**: The landing page (`src/app/page.tsx`) must be extremely minimalist: Title, Subtitle, and a single "Start Survey" button.
- **D-04**: No images or distractions. Use whitespace and typography to create a sense of authority and calm.

### Global Refinements
- **D-05**: Update `globals.css` to set the default background and text colors.
- **D-06**: Ensure consistent rounding (`rounded-xl` or `rounded-2xl`) across all components.

</decisions>

<canonical_refs>
## Canonical References

### Project Core
- \`.planning/PROJECT.md\`
- \`.planning/REQUIREMENTS.md\`

</canonical_refs>

<code_context>
## Existing Code Insights

- `src/app/page.tsx` is currently a placeholder (Next.js default or empty).
- `src/app/globals.css` needs standard Tailwind imports and base styles.

</code_context>

---

*Phase: 04-warm-civic-ui*
*Context gathered: 2026-04-23*
