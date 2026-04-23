import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  where
} from "firebase/firestore";

export interface SurveyResultRecord {
  candidateId: string;
  candidateName: string;
  raceId: string;
  topIssues: string[];
  score: number;
}

export const firebaseService = {
  /**
   * Saves a survey result to Firestore.
   * Ensures no PII is stored.
   */
  async saveResult(data: SurveyResultRecord) {
    try {
      await addDoc(collection(db, "results"), {
        ...data,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firestore Save Error:", error);
      // Fail gracefully - don't crash the app
    }
  },

  /**
   * Fetches aggregate stats for a specific race.
   * Uses limited queries to optimize reads.
   */
  async getRaceStats(raceId: string) {
    try {
      const q = query(
        collection(db, "results"),
        where("raceId", "==", raceId),
        orderBy("timestamp", "desc"),
        limit(100)
      );
      
      const querySnapshot = await getDocs(q);
      
      const candidateCounts: Record<string, number> = {};
      const issueCounts: Record<string, number> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        candidateCounts[data.candidateName] = (candidateCounts[data.candidateName] || 0) + 1;
        data.topIssues?.forEach((issue: string) => {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
      });

      const topCandidate = Object.entries(candidateCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
        
      const commonIssue = Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

      return { topCandidate, commonIssue };
    } catch (error) {
      console.error("Firestore Read Error:", error);
      return { topCandidate: "N/A", commonIssue: "N/A" };
    }
  }
};
