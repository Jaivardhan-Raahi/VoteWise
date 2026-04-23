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

export interface CommunityStats {
  topCandidate: string;
  topIssues: string[];
  averageScore: number;
  totalSubmissions: number;
  candidateBreakdown: Record<string, number>;
}

// Simple client-side cache to avoid redundant reads
let statsCache: { data: CommunityStats; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const firebaseService = {
  /**
   * Saves a survey result to Firestore.
   */
  async saveResult(data: SurveyResultRecord) {
    try {
      await addDoc(collection(db, "results"), {
        ...data,
        timestamp: serverTimestamp(),
      });
      // Invalidate cache after new submission
      statsCache = null;
    } catch (error) {
      console.error("Firestore Save Error:", error);
    }
  },

  /**
   * Fetches aggregate stats for a specific race with caching.
   */
  async getRaceStats(raceId: string): Promise<CommunityStats> {
    const now = Date.now();
    if (statsCache && (now - statsCache.timestamp < CACHE_TTL)) {
      return statsCache.data;
    }

    try {
      // Query last 200 results for a representative sample without excessive cost
      const q = query(
        collection(db, "results"),
        where("raceId", "==", raceId),
        orderBy("timestamp", "desc"),
        limit(200)
      );
      
      const querySnapshot = await getDocs(q);
      
      const candidateCounts: Record<string, number> = {};
      const issueCounts: Record<string, number> = {};
      let totalScore = 0;
      let count = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalScore += data.score || 0;
        count++;

        candidateCounts[data.candidateName] = (candidateCounts[data.candidateName] || 0) + 1;
        data.topIssues?.forEach((issue: string) => {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
      });

      const topIssues = Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      const topCandidate = Object.entries(candidateCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

      const data: CommunityStats = {
        topCandidate,
        topIssues,
        averageScore: count > 0 ? Math.round(totalScore / count) : 0,
        totalSubmissions: count,
        candidateBreakdown: candidateCounts
      };

      statsCache = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error("Firestore Read Error:", error);
      return {
        topCandidate: "N/A",
        topIssues: [],
        averageScore: 0,
        totalSubmissions: 0,
        candidateBreakdown: {}
      };
    }
  }
};
