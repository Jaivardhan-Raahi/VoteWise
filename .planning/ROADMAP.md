# Roadmap: VoteWise

## Phases
- [ ] **Phase 1: Foundation & Candidate Data** - Define data structures, race selection, and scoring logic.
- [ ] **Phase 2: Survey Core** - Implement the multi-step survey with weighting and local persistence.
- [ ] **Phase 3: Warm Civic UI** - Apply the minimalist design system and typography across the application.
- [ ] **Phase 4: Alignment Results & Comparison** - Deliver candidate proximity visualizations and side-by-side comparisons.

## Phase Details

### Phase 1: Foundation & Candidate Data
**Goal**: Establish the core data strategy and matching logic.
**Depends on**: Nothing
**Requirements**: LOC-01, ALGN-01, DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. User can retrieve a hardcoded list of political races and their candidates.
  2. Scoring engine calculates alignment percentages accurately based on candidate data (0-10 scale).
  3. Candidate data schema includes verified source URLs for all political stances.
**Plans**: 2 plans
- [x] 01-01-PLAN.md — Initialize Next.js 15 project and define data schemas/seed data.
- [x] 01-02-PLAN.md — Implement alignment scoring engine and data registry utility.

### Phase 2: Survey Core
**Goal**: Implement the primary user interaction for capturing political stances.
**Depends on**: Phase 1
**Requirements**: SURV-01, SURV-02, SURV-03
**Success Criteria** (what must be TRUE):
  1. User can navigate a multi-step survey using a 0-10 scale.
  2. User can assign importance weights (Low/Med/High) to specific issues.
  3. Survey state persists locally in the browser and survives page refreshes (Privacy-First).
**Plans**: 2 plans
- [x] 02-01-PLAN.md — Establish the persistent survey state and issue metadata.
- [ ] 02-02-PLAN.md — Implement the survey wizard UI and question components.

### Phase 3: Warm Civic UI
**Goal**: Implement the "Warm Civic Minimalist" design system and responsive layout.
**Depends on**: Phase 2
**Requirements**: UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Landing page displays the "Warm Civic" aesthetic with clear call-to-action.
  2. Public Sans typography and organic palette are consistently applied across all views.
  3. Application is fully responsive and optimized for mobile-first usage.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Alignment Results & Comparison
**Goal**: Provide users with objective alignment insights and candidate comparisons.
**Depends on**: Phase 3
**Requirements**: ALGN-02, ALGN-03
**Success Criteria** (what must be TRUE):
  1. User can view a proximity visualization showing their alignment percentage with each candidate.
  2. User can compare their stances side-by-side with candidates in a "Snackable" view.
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Candidate Data | 2/2 | Completed | 2026-04-23 |
| 2. Survey Core | 1/2 | In Progress | - |
| 3. Warm Civic UI | 0/1 | Not started | - |
| 4. Alignment Results & Comparison | 0/1 | Not started | - |
