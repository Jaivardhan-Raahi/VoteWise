"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getMatchExplanation(candidateName: string, topIssues: string[]) {
  console.log("Gemini Debug: Starting getMatchExplanation request");
  
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("Gemini Debug: API Key configured:", !!apiKey);

    if (!apiKey) {
      console.error("Gemini Debug: Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
      return "AI explanation temporarily unavailable due to high demand. Please try again.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Updated to the newest high-performance model (Gemini 2.0 Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      A user has been matched with political candidate ${candidateName}. 
      The user's top prioritized issues are: ${topIssues.join(", ")}.
      Write a brief, 2-line explanation of why this is a good match based on these priorities.
      Keep it neutral, objective, and concise. 
      Format: "You prioritized [Issues]. ${candidateName} aligns with these because..."
    `.trim();

    console.log("Gemini Debug: Request payload prompt:", prompt);

    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("Empty response object received from Gemini API");
    }

    const responseText = result.response.text();
    console.log("Gemini Debug: Response text received successfully:", responseText);

    return responseText;
  } catch (error: any) {
    console.error("Gemini FULL ERROR:", error);
    if (error?.response) {
      console.error("Gemini ERROR RESPONSE:", JSON.stringify(error.response, null, 2));
    }
    console.error("Gemini ERROR STACK:", error?.stack);
    
    return "AI explanation temporarily unavailable due to high demand. Please try again.";
  }
}
