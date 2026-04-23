# Architecture Patterns

**Domain:** Voter Alignment Tool
**Researched:** 2024-10-24

## Recommended Architecture

A modern Next.js App Router architecture focusing on **Client-Side Scoring** for privacy and **Server-Side Data** for candidate datasets.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `SurveyStore` (Zustand) | Manages user answers and progress. | All survey screens. |
| `ScoringEngine` | Pure function: Calculates distance between user and candidates. | `SurveyStore`, `ResultView`. |
| `CandidateData` | Fetches/serves candidate stances. | `ScoringEngine`, `ComparisonView`. |
| `VizLibrary` | Wraps Recharts for alignment visualization. | `ScoringEngine`. |

### Data Flow

1. **User enters landing page** (Server Component).
2. **User starts survey:** State is initialized in Zustand `SurveyStore`.
3. **Survey interactions:** Each step updates `SurveyStore`.
4. **Completion:** `ScoringEngine` runs a Weighted Euclidean Distance calculation against the `CandidateData` (JSON or Supabase fetch).
5. **Results:** `ResultView` renders the alignment scores via `VizLibrary`.

## Patterns to Follow

### Pattern 1: Step-Based Navigation
**What:** Use a URL-synchronized or state-driven wizard for the survey.
**When:** For any survey with more than 5 questions.
**Example:**
```typescript
const { currentStep, nextStep } = useSurveyStore();
return (
  <AnimatePresence mode="wait">
    <motion.div key={currentStep}>
      {renderStep(currentStep)}
    </motion.div>
  </AnimatePresence>
)
```

### Pattern 2: Headless Forms
**What:** Decouple form logic (validation, state) from UI components using React Hook Form.
**Why:** Essential for the "Warm Civic" theme which requires highly custom, paper-like UI components that don't fit standard HTML form inputs.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Server-Side Scoring
**What:** Sending user answers to the server to calculate the match.
**Why bad:** High latency, privacy concerns (transmitting political leanings), and unnecessary server load.
**Instead:** Perform the calculation in a Client Component or Web Worker.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Data Fetching | Static JSON | Edge Config / Supabase | Edge Cached API |
| Calculation | Main Thread | Web Worker | Web Worker |

## Sources

- **Vercel Architecture Patterns:** Next.js App Router best practices.
- **Privacy-By-Design Principles:** For civic technology.
