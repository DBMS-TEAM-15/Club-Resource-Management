import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [clubs] = await pool.query<RowDataPacket[]>(`SELECT * FROM CLUB ORDER BY club_name ASC`);
    const [categories] = await pool.query<RowDataPacket[]>(`SELECT * FROM RESOURCE_CATEGORY ORDER BY category_name ASC`);
    return NextResponse.json({ clubs, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { club_name, description, category } = await req.json();
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO CLUB (club_name, description, category) VALUES (?, ?, ?)`,
      [club_name, description, category]
    );
    return NextResponse.json({ club_id: res.insertId, club_name, description, category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}