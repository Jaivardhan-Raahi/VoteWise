# Research Summary: VoteWise

**Project:** VoteWise  
**Status:** Research Synthesized  
**Date:** 2024-10-24

## Executive Summary

VoteWise is a Voter Advice Application (VAA) designed to provide an objective, "Calm Civic" experience for voters seeking alignment with political candidates. Moving away from the high-anxiety, ad-driven nature of modern political media, VoteWise prioritizes minimalist design, data privacy, and scientific accuracy. The platform uses a multi-step Likert-scale survey to capture voter stances and matches them against a curated candidate dataset using a Weighted Euclidean Distance algorithm.

The research recommends a 2025-standard technology stack centered on Next.js 15, React 19, and Tailwind CSS 4. The architecture is designed for privacy-first, client-side scoring, ensuring that sensitive political preferences remain on the user's device. By explicitly avoiding social features and news feeds, VoteWise focuses entirely on the objective alignment between voter values and candidate platforms.

## Key Findings

### Technology Stack (from STACK.md)
- **Core Framework:** Next.js 15 (App Router) and React 19 for high-performance server/client interaction.
- **Styling:** Tailwind CSS 4.x for a "Warm Civic" aesthetic.
- **State & Forms:** Zustand for global survey state and React Hook Form for performant, headless form logic.
- **Database:** Supabase for managing the candidate dataset and optional user data.
- **Scoring:** Weighted Euclidean Distance algorithm to accurately capture intensity of preference.

### Feature Landscape (from FEATURES.md)
- **Table Stakes:** Multi-step survey, candidate matching, results visualization, and responsive design.
- **Differentiators:** "Warm Civic" UI (trust-building), issue weighting, and a privacy-first "Calm Mode".
- **Anti-Features:** No social sharing, no comment sections, and no political news feeds to avoid toxicity and bias.

### Architecture Patterns (from ARCHITECTURE.md)
- **Client-Side Scoring:** Calculates matches locally to protect user privacy and reduce latency.
- **State-Driven Wizard:** Uses Zustand to manage complex multi-step survey progression.
- **Headless UI:** Decouples form logic from the "Warm Civic" custom components for maximum flexibility.

### Domain Pitfalls (from PITFALLS.md)
- **Question Bias:** The highest risk; requires impartial review to maintain "Objective" core value.
- **Binary Scoring:** Avoided by using proximity-based distance (Euclidean) rather than simple match percentages.
- **Neutral Bias:** Mitigation through vector normalization to prevent neutral users from matching moderate candidates by accident.

## Roadmap Implications

### Suggested Phase Structure

1. **Phase 1: Foundation & Data Strategy**
   - **Rationale:** Establishing the data schema and candidate dataset is the critical path for the scoring engine.
   - **Deliverables:** Next.js/Supabase scaffold, Zod schemas for candidates, and initial data import.
   - **Pitfalls to Avoid:** Hard-coding candidate data.

2. **Phase 2: Survey Core & Scoring Engine**
   - **Rationale:** The survey is the primary user interaction. Implementing the scoring engine early allows for algorithm validation.
   - **Deliverables:** Multi-step survey wizard, Euclidean distance calculation logic, and state management via Zustand.
   - **Pitfalls to Avoid:** Performance lag on complex forms; floating point errors in scoring.

3. **Phase 3: Warm Civic UI & Visualization**
   - **Rationale:** Once the data and logic are sound, the "Warm Civic" aesthetic and visualizations provide the primary value to the user.
   - **Deliverables:** Tailwind 4 design system implementation, Recharts-based alignment graphs, and mobile-first refinement.
   - **Pitfalls to Avoid:** Over-complex or misleading visualizations.

4. **Phase 4: Advanced Weighting & Polish**
   - **Rationale:** Issue weighting is a differentiator that adds complexity; best added once the core engine is stable.
   - **Deliverables:** Custom issue weighting UI, "Calm Mode" toggles, and performance optimization.

### Research Flags
- **Requires Research Phase:** Scientific review of survey questions and weighting factors.
- **Standard Patterns:** Wizard navigation, Tailwind styling, and Vercel deployment (skip deeper research).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on 2025 industry standards and framework stability. |
| Features | HIGH | Clear alignment between PRD goals and VAA best practices. |
| Architecture | HIGH | Privacy-first client-side model is well-documented for civic tech. |
| Pitfalls | MEDIUM | Algorithmic nuances (magnitude vs direction) require careful testing. |

**Gaps to Address:**
- Finalization of the source dataset for candidates.
- Specific accessibility audit requirements for civic tools.

## Sources
- Next.js 15 & Tailwind CSS 4 Official Documentation.
- Political Science Methodology: Research on Voter Advice Applications (VAAs) and Spatial Theory of Voting.
- Vercel Architecture Patterns & Privacy-By-Design Principles.
- Civic Tech Case Studies and Design Best Practices.
