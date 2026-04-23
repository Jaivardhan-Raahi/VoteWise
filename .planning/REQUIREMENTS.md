# Requirements: VoteWise

**Defined**: 2026-04-23
**Core Value**: Objective, distraction-free determination of voter alignment with candidates.

## v1 Requirements

### UI & Theme
- [ ] **UI-01**: Landing page with "Warm Civic Minimalist" aesthetic and clear CTA.
- [ ] **UI-02**: Implementation of Public Sans typography and the "paper-like" organic palette.
- [ ] **UI-03**: Responsive, mobile-first design following the "Bite-Snack-Meal" hierarchy.

### Location & Context
- [ ] **LOC-01**: User can select a specific race to begin alignment matching (hardcoded list or manual selection for MVP).

### Survey & Stances
- [ ] **SURV-01**: Multi-step survey using a 0–10 scale for user and candidate stances.
- [ ] **SURV-02**: User can assign weights (e.g., Low, Medium, High importance) to specific issues.
- [ ] **SURV-03**: Client-side survey state persistence using Zustand and localStorage (Privacy-First).

### Alignment & Comparison
- [ ] **ALGN-01**: Scoring engine using simple weighted sum scoring for alignment calculation.
- [ ] **ALGN-02**: Proximity visualization showing alignment percentage per candidate.
- [ ] **ALGN-03**: Side-by-side "Snackable" comparison view of candidate stances.

### Candidate Data
- [ ] **DATA-01**: Static JSON schema for candidate profiles, stances, and source links.
- [ ] **DATA-02**: Transparent sourcing: Every stance must have a verified source URL.

## v2 Requirements

### Location & Context
- **LOC-02**: User can enter an address/ZIP to identify relevant candidate races (automatic lookup).

### Advanced Alignment
- **SURV-04**: "Blind Matching" mode (candidates revealed only after survey completion).
- **ALGN-04**: Multi-dimensional radar charts for alignment visualization.

### Automation
- **DATA-03**: Integration with external APIs (e.g., Google Civic Info API) for ballot data.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Social Sharing | Violates the core value of private, objective decision-making. |
| User Accounts | Backend storage of political leanings is a privacy liability. |
| News Feed | Introduces distraction and potential bias; violates minimalist core. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 3 | Pending |
| UI-02 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |
| LOC-01 | Phase 1 | Pending |
| SURV-01 | Phase 2 | Pending |
| SURV-02 | Phase 2 | Pending |
| SURV-03 | Phase 2 | Pending |
| ALGN-01 | Phase 1 | Pending |
| ALGN-02 | Phase 4 | Pending |
| ALGN-03 | Phase 4 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-23*
*Last updated: 2026-04-23 after initialization*
