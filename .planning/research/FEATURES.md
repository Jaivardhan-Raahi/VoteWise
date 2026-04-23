# Feature Landscape

**Domain:** Voter Alignment Tool
**Researched:** 2024-10-24

## Table Stakes

Features users expect in a modern Voter Advice Application (VAA).

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multi-step Survey | Core interaction for capturing voter stance. | Medium | Needs smooth transitions and progress indicators. |
| Candidate Matching | The primary value prop. | Medium | Requires robust scoring algorithm (Euclidean). |
| Result Visualization | Users need to see "why" they match. | High | Must be intuitive (e.g., proximity charts). |
| Comparison View | Side-by-side comparison with top candidates. | Low | Simple data table or card view. |
| Responsive Design | Many voters check these tools on mobile. | Low | Tailwind's mobile-first approach handles this. |

## Differentiators

Features that set VoteWise apart from cluttered, ad-heavy political sites.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Warm Civic UI | Builds trust and reduces "political anxiety". | Low | Focus on typography (Public Sans) and whitespace. |
| Issue Weighting | Allows voters to say "this issue matters more to me". | Medium | Essential for accurate alignment. |
| Privacy-First | No data stored on server by default. | Low | Uses client-side state (Zustand) and local storage. |
| "Calm" Mode | Minimalist distractions; no news feeds or ads. | Low | Pure focus on the survey and data. |

## Anti-Features

Features to explicitly NOT build to maintain the project's vision.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Social Sharing | Encourages bias and performance-seeking. | Focus on private, objective analysis. |
| Comment Sections | Leads to toxicity and distraction. | Provide links to official candidate manifestos. |
| Political News Feed | Distracts from objective data alignment. | Keep data static/curated for the current election. |

## Feature Dependencies

```
Survey System → Scoring Engine → Visualization UI
Candidate Dataset → Comparison View
```

## MVP Recommendation

Prioritize:
1. **Candidate Dataset:** Hand-curated objective stances for top 5-10 candidates.
2. **Linear Survey:** 15-20 core questions with 5-point Likert scale.
3. **Scoring Engine:** Euclidean distance calculation.
4. **Simple Result Chart:** Proximity list + single visualization.

Defer: **Custom Issue Weighting** (Phase 2), **User Profiles** (Phase 3).

## Sources

- **Political Science Review:** "Design of Voter Advice Applications".
- **Civic Tech Best Practices:** Focus on accessibility and trust-building.
