"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function getMatchExplanation(candidateName: string, topIssues: string[]) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return "Explanation unavailable (API key missing).";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    A user has been matched with political candidate ${candidateName}. 
    The user's top prioritized issues are: ${topIssues.join(", ")}.
    Write a brief, 2-line explanation of why this is a good match based on these priorities.
    Keep it neutral, objective, and concise. 
    Format: "You prioritized [Issues]. ${candidateName} aligns with these because..."
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate match explanation at this time.";
  }
}
