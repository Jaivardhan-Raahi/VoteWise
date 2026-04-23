import { SurveyWizard } from "@/components/SurveyWizard";

export default function SurveyPage() {
  // For now, we default to the 2024 Presidential race as per PRD/Plan
  const raceId = "pres-2024";

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
            Political Alignment Survey
          </h1>
          <p className="text-lg text-zinc-600">
            Answer the following questions to see which candidates align best with your views.
          </p>
        </header>

        <SurveyWizard raceId={raceId} />
      </div>
    </main>
  );
}
