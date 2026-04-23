# Domain Pitfalls

**Domain:** Voter Alignment Tool
**Researched:** 2024-10-24

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Binary Scoring (Match/No Match)
**What goes wrong:** Reducing candidate alignment to a simple binary or percentage without context.
**Why it happens:** Attempting to oversimplify for UX.
**Consequences:** Misleads voters; candidates with 51% match feel the same as 99%.
**Prevention:** Use Euclidean distance to show *proximity* and allow users to drill down into specific issue alignment.
**Detection:** Check if users are confused by "why" a candidate is recommended.

### Pitfall 2: Question Bias
**What goes wrong:** Wording questions in a way that leads the user to a specific answer.
**Why it happens:** Unconscious bias in content creation.
**Consequences:** Product loses "Objective" core value and trust.
**Prevention:** Use established datasets or hire/use impartial political scientists to review survey questions.
**Detection:** High "Neutral" response rates or polarized results.

## Moderate Pitfalls

### Pitfall 1: Magnitude vs. Direction
**What goes wrong:** A user who is "Neutral" on everything appearing close to a moderate candidate by accident.
**Prevention:** Normalize vectors or include a "Minimum Participation" threshold before showing results.

## Minor Pitfalls

### Pitfall 1: Performance Lag on Complex Forms
**What goes wrong:** Using standard React state for a 50-question survey causing re-render lag.
**Prevention:** Use `React Hook Form` (uncontrolled inputs) or `Zustand` with selectors.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Data Modeling | Hard-coding candidates | Use a JSON schema or Supabase to allow easy data updates. |
| Scoring Engine | Floating point errors | Use an epsilon value for comparisons or simple rounding for display. |
| UI Extraction | Over-complex Stitch CSS | Rebuild cleanly with Tailwind; ignore Stitch's inline styles where possible. |

## Sources

- **Political Science Review:** "Evaluating the Accuracy of Voter Advice Applications".
- **Civic Tech Case Studies:** Analysis of successful (and failed) voter tools.
