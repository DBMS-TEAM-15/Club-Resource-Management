import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = Number(searchParams.get("resourceId"));
    const qty = Number(searchParams.get("quantity") || "1");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!resourceId || !startTime || !endTime) {
      return NextResponse.json({ error: "resourceId, startTime, and endTime are required" }, { status: 400 });
    }

    const [conflictResultSets] = await pool.query<RowDataPacket[][]>(
      `CALL sp_check_scheduling_conflict(?, ?, ?, ?)`,
      [resourceId, qty, startTime, endTime]
    );
    const status = conflictResultSets[0]?.[0] || { has_conflict: 0, quantity_available: 0 };

    let alternatives: any[] = [];
    if (status.has_conflict) {
      const [altResultSets] = await pool.query<RowDataPacket[][]>(
        `CALL sp_suggest_alternative_resources(?, ?, ?, ?)`,
        [resourceId, qty, startTime, endTime]
      );
      alternatives = altResultSets[0] || [];
    }

    return NextResponse.json({
      conflict: {
        ...status,
        has_conflict: Boolean(status.has_conflict),
      },
      alternatives,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
