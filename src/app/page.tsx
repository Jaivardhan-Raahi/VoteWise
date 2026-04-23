import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        <header className="space-y-6">
          <h1 className="text-6xl font-black text-foreground tracking-tight sm:text-7xl">
            Your Voice, <br />
            <span className="text-zinc-500">Quantified.</span>
          </h1>
          <p className="text-xl text-zinc-600 leading-relaxed max-w-lg mx-auto font-medium">
            Find which candidates actually align with your stances, 
            without the noise of political theater.
          </p>
        </header>

        <div className="flex justify-center">
          <Link
            href="/survey"
            className="group relative px-12 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg transition-all hover:bg-zinc-800 hover:shadow-2xl active:scale-95"
          >
            Start Alignment Survey
            <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2 text-left">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Retrieval-Augmented AI</h3>
            <p className="text-sm font-bold text-zinc-900 leading-tight">Grounded results powered by Gemini 1.5 & Verified Data.</p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2 text-left">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Distributed Counters</h3>
            <p className="text-sm font-bold text-zinc-900 leading-tight">High-concurrency community insights via Firestore.</p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2 text-left">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Privacy Focused</h3>
            <p className="text-sm font-bold text-zinc-900 leading-tight">No personal identifiers. Only stances are quantified.</p>
          </div>
        </section>

        <footer className="pt-12 border-t border-zinc-100">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
              Tech Stack: Next.js 15 • Firebase • Gemini • Playwright • Vitest
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
