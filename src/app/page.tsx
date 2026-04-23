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

        <footer className="pt-12 border-t border-zinc-100">
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
            100% Client-side. Your data stays on your device.
          </p>
        </footer>
      </div>
    </main>
  );
}
