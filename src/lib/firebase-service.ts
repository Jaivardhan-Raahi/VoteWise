import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc, 
  increment,
  runTransaction
} from "firebase/firestore";
import { errorHandler, ErrorCategory } from "./error-handler";

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

const ANALYTICS_DOC_ID = "community_summary";

export const firebaseService = {
  /**
   * Saves a survey result and atomically updates aggregated analytics.
   * Implementation of Task 1: Separate raw data vs computed data.
   */
  async saveResult(data: SurveyResultRecord) {
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Save raw result
        const resultRef = doc(collection(db, "results"));
        transaction.set(resultRef, {
          ...data,
          timestamp: serverTimestamp(),
        });

        // 2. Update computed analytics
        const analyticsRef = doc(db, "analytics", `${data.raceId}_${ANALYTICS_DOC_ID}`);
        const analyticsSnap = await transaction.get(analyticsRef);

        const issueUpdates: Record<string, any> = {};
        data.topIssues.forEach(issue => {
          issueUpdates[`issueCounts.${issue}`] = increment(1);
        });

        if (!analyticsSnap.exists()) {
          transaction.set(analyticsRef, {
            candidateCounts: { [data.candidateName]: 1 },
            issueCounts: data.topIssues.reduce((acc, iss) => ({ ...acc, [iss]: 1 }), {}),
            totalScore: data.score,
            count: 1,
            lastUpdated: serverTimestamp(),
          });
        } else {
          transaction.update(analyticsRef, {
            [`candidateCounts.${data.candidateName}`]: increment(1),
            ...issueUpdates,
            totalScore: increment(data.score),
            count: increment(1),
            lastUpdated: serverTimestamp(),
          });
        }
      });
    } catch (error) {
      errorHandler.log(new Error(`Failed to save result: ${error}`));
    }
  },

  /**
   * Fetches aggregated stats from the analytics collection.
   * Implementation of Task 4: Efficient read via single document.
   */
  async getRaceStats(raceId: string): Promise<CommunityStats | null> {
    try {
      const analyticsRef = doc(db, "analytics", `${raceId}_${ANALYTICS_DOC_ID}`);
      const snap = await getDoc(analyticsRef);

      if (!snap.exists()) return null;

      const data = snap.data();
      const candidateCounts = data.candidateCounts || {};
      const issueCounts = data.issueCounts || {};
      const count = data.count || 0;

      const topIssues = Object.entries(issueCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      const topCandidate = Object.entries(candidateCounts)
        .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A";

      return {
        topCandidate,
        topIssues,
        averageScore: count > 0 ? Math.round(data.totalScore / count) : 0,
        totalSubmissions: count,
        candidateBreakdown: candidateCounts
      };
    } catch (error) {
      errorHandler.handle(ErrorCategory.FIREBASE, "Failed to fetch analytics", error);
      return null;
    }
  }
};
