"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Deterministic Fallback Analysis (RAG-based)
 * Generates an intelligent, data-driven response when Gemini is unavailable.
 */
function generateFallbackAnalysis(
  candidateName: string, 
  topIssues: string[],
  context: { issue: string; quote: string | undefined }[]
): string {
  const issueRef = topIssues.length > 1 
    ? `${topIssues.slice(0, -1).join(", ")} and ${topIssues[topIssues.length - 1]}`
    : topIssues[0] || "your core priorities";

  const stanceHighlights = context
    .filter(c => c.quote)
    .slice(0, 2)
    .map(c => `${c.issue} (${c.quote})`)
    .join(" and ");

  const base = `Your alignment with ${candidateName} is primarily driven by your focus on ${issueRef}. `;
  const detail = stanceHighlights 
    ? `Their platform directly addresses these via specific commitments to ${stanceHighlights}.`
    : `Their verified voting record and official platform consistently prioritize these pillars across legislative sessions.`;

  return `${base}${detail}`;
}

export async function getMatchExplanation(
  candidateName: string, 
  topIssues: string[],
  candidateContext: { issue: string; quote: string | undefined }[],
  retries = 1 // Reduced retries for faster fallback
): Promise<string> {
  // 1. Construct the Hybrid RAG Prompt
  const contextString = candidateContext
    .map(c => `- ${c.issue}: ${c.quote ? `"${c.quote}"` : "Stance matches core platform values."}`)
    .join("\n");

  const prompt = `
    Match Summary: User matched with ${candidateName}.
    Top User Priorities: ${topIssues.join(", ")}.

    Candidate Stances Context:
    ${contextString}

    Task: Provide an authoritative, neutral, and data-driven alignment analysis in exactly 2 sentences. 
    Base your analysis STRICTLY on the Candidate Stances Context provided. 
    Explain how ${candidateName}'s specific policies or quotes directly address the user's focus on ${topIssues.join(" and ")}.

    Format: "Your alignment with ${candidateName} is primarily driven by your focus on ${topIssues.join(" and ")}. Their platform directly addresses these via..."
  `.trim();

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "undefined") throw new Error("Missing/Invalid API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { maxOutputTokens: 150, temperature: 0.4 }
    });

    // 2. Attempt Gemini Generation with strict timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 4000))
    ]);

    const text = result.response.text();
    if (!text) throw new Error("Empty response");

    console.log(`[AI] Gemini successful for ${candidateName}`);
    return text.trim();

  } catch (error: any) {
    // 3. Handle Transient Errors / Quota issues
    const isTransient = error.message?.includes("503") || 
                        error.message?.includes("429") || 
                        error.message?.includes("high demand") ||
                        error.message?.includes("Timeout");

    if (retries > 0 && isTransient) {
      console.log(`[AI] Gemini transient error (${error.message}). Retrying...`);
      await delay(1000);
      return getMatchExplanation(candidateName, topIssues, candidateContext, retries - 1);
    }

    // 4. Primary Safety: Deterministic Fallback
    console.log(`[AI] Gemini unavailable/quota exceeded. Using Deterministic RAG Fallback.`);
    return generateFallbackAnalysis(candidateName, topIssues, candidateContext);
  }
}

