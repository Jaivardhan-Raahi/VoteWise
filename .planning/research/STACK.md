# Technology Stack

**Project:** VoteWise
**Researched:** 2024-10-24
**Target Standard:** 2025 Standard

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x | Full-stack framework | Industry standard for 2025; App Router and Server Actions provide the best DX for minimalist data processing. |
| React | 19.x | UI Library | Required by Next.js 15; leverages the new React Compiler and better transition management. |
| Tailwind CSS | 4.x | Styling | PRD Requirement. v4's Rust-based engine and CSS-first configuration are significantly faster and more future-proof. |
| TypeScript | 5.x | Type Safety | Ensures the scoring algorithm and candidate datasets are type-safe and bug-free. |

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase | Latest | Data Storage & Auth | Provides a solid PostgreSQL foundation with minimal configuration. Perfect for storing candidate data and optional user profiles. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | N/A | Hosting & Deployment | Native support for Next.js features like ISR and Edge Functions, essential for a high-performance "Calm Civic" experience. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.x | State Management | To track survey progress and store alignment scores across pages without the overhead of Redux. |
| React Hook Form | 7.x | Survey Management | To handle multi-step survey inputs with high performance and deep React 19 integration. |
| Zod | 4.x | Data Validation | To validate survey responses and ensure candidate JSON data follows strict schemas. |
| Recharts | 3.x | Data Visualization | To render the final alignment graph (e.g., proximity charts or spider charts) in an accessible way. |
| Lucide React | 1.x | Iconography | High-quality, tree-shakable icons that fit the "Minimalist" aesthetic. |
| Shadcn UI | 2.x | Component Primitives | Standard for 2025; allows building custom, accessible components with the "Warm Civic Minimalism" theme. |

## Scoring Algorithm

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| Algorithm | **Weighted Euclidean Distance** | Better than Cosine Similarity for Likert scales (1-5); captures "intensity" of voter preference. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State Management | Zustand | Redux Toolkit | Too much boilerplate for a minimalist tool; harder to maintain for small teams. |
| Survey Logic | React Hook Form | SurveyJS | SurveyJS is powerful but heavy and difficult to theme with a custom Tailwind-based design system. |
| UI Library | Shadcn/UI | Material UI | Material UI is opinionated and heavy; Shadcn/UI provides full control over the "Warm Civic" aesthetic. |
| Database | Supabase | Local JSON | Local JSON is easier for MVP but makes data updates (candidate changes) harder without redeploying. |

## Installation

```bash
# Core
npm install next@latest react@latest react-dom@latest tailwindcss@latest lucide-react zustand react-hook-form zod recharts @supabase/supabase-js

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom postcss autoprefixer
```

## Sources

- **Next.js 15 Release Notes:** Official Vercel documentation.
- **Tailwind CSS v4 Blog:** Official Tailwind CSS updates (January 2025 status).
- **Zustand v5 Migration Guide:** Official PMNDRS documentation.
- **Political Science Methodology:** Research on Voter Advice Applications (VAAs) and the Spatial Theory of Voting (Euclidean distance preference).
- **React Hook Form / Zod 2025 Roadmap:** Community discussions on React 19 compatibility.
