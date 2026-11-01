import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get("clubId");
    const status = searchParams.get("status");

    const filters: string[] = [];
    const params: any[] = [];

    if (clubId) {
      filters.push(`(req.club_id = ? OR r.club_id = ?)`);
      params.push(Number(clubId), Number(clubId));
    }
    if (status) {
      filters.push(`req.status = ?`);
      params.push(status);
    }

    const whereSql = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        req.*,
        c.club_name AS requesting_club_name,
        r.name AS resource_name,
        r.club_id AS owner_club_id,
        oc.club_name AS owner_club_name,
        a.allocation_id,
        a.status AS allocation_status
       FROM REQUEST req
       JOIN CLUB c ON c.club_id = req.club_id
       JOIN RESOURCE r ON r.resource_id = req.resource_id
       JOIN CLUB oc ON oc.club_id = r.club_id
       LEFT JOIN ALLOCATION a ON a.request_id = req.request_id
       ${whereSql}
       ORDER BY req.request_date DESC`,
      params
    );

    return NextResponse.json({ requests: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { club_id, resource_id, purpose, quantity_requested, start_time, end_time } = await req.json();

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO REQUEST (club_id, resource_id, purpose, quantity_requested, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Number(club_id), Number(resource_id), purpose, Number(quantity_requested), start_time, end_time]
    );

    return NextResponse.json(
      {
        request: {
          request_id: res.insertId,
          club_id,
          resource_id,
          purpose,
          quantity_requested,
          start_time,
          end_time,
          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
