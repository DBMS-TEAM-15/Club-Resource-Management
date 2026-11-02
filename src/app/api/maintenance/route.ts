import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { Int32 } from "mongodb";
import { RowDataPacket } from "mysql2";

const DB_NAME = "campus_club_resource_exchange";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get("resourceId");
    const userId = searchParams.get("userId");

    if (userId) {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM NOTIFICATION ORDER BY created_at DESC LIMIT 25`
      );
      return NextResponse.json({ notifications: rows });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const filter = resourceId ? { resource_id: Number(resourceId) } : {};
    const logs = await db.collection("maintenance_logs").find(filter).sort({ created_at: -1 }).toArray();

    return NextResponse.json({ maintenance_logs: logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resource_id, reported_by_user_id, issue_type, notes, condition_before, condition_after, cost_incurred } =
      body;

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);

    const logDoc = {
      resource_id: new Int32(Number(resource_id)),
      reported_by_user_id: new Int32(Number(reported_by_user_id || 2)),
      issue_type: issue_type || "routine_check",
      notes: String(notes || ""),
      condition_before: String(condition_before || "good"),
      condition_after: condition_after || "good",
      checklist: { inspected: true },
      cost_incurred: Number(cost_incurred || 0),
      created_at: new Date(),
    };

    await db.collection("maintenance_logs").insertOne(logDoc);

    if (condition_after) {
      await pool.query(`UPDATE RESOURCE SET \`condition\` = ? WHERE resource_id = ?`, [
        condition_after,
        Number(resource_id),
      ]);
    }

    return NextResponse.json({ log: logDoc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
