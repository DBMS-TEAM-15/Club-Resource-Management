import { NextResponse } from "next/server";
import {
  getFrequentlyRequestedResources,
  getInterClubBorrowingPatterns,
  getUnderutilizedAndClubSummary,
} from "@/lib/db/analyticsQueries";
import { getMaintenanceSummaryByIssueType } from "@/lib/db/aggregations";

export async function GET() {
  try {
    const [frequentlyRequested, borrowingPatterns, summary] = await Promise.all([
      getFrequentlyRequestedResources(),
      getInterClubBorrowingPatterns(),
      getUnderutilizedAndClubSummary(),
    ]);

    let maintenanceSummary: any[] = [];
    try {
      maintenanceSummary = await getMaintenanceSummaryByIssueType();
    } catch {
      // Fallback if MongoDB is unavailable
    }

    return NextResponse.json({
      frequentlyRequested,
      borrowingPatterns,
      underutilized: summary.underutilized,
      clubUtilization: summary.clubUtilization,
      maintenanceSummary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
