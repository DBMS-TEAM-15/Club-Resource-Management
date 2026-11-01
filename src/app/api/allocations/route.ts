import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const { action, request_id, allocation_id, approved_by } = await req.json();
    await conn.beginTransaction();

    if (action === "approve") {
      const [reqRows] = await conn.query<RowDataPacket[]>(
        `SELECT * FROM REQUEST WHERE request_id = ? FOR UPDATE`,
        [Number(request_id)]
      );
      if (!reqRows[0]) {
        throw new Error("Request not found");
      }
      const requestRow = reqRows[0];

      await conn.query(`UPDATE REQUEST SET status = 'approved' WHERE request_id = ?`, [Number(request_id)]);

      const [allocRes] = await conn.query<ResultSetHeader>(
        `INSERT INTO ALLOCATION (request_id, quantity_allocated, status, approved_by)
         VALUES (?, ?, 'allocated', ?)`,
        [Number(request_id), Number(requestRow.quantity_requested), approved_by ? Number(approved_by) : null]
      );

      await conn.commit();
      return NextResponse.json({ allocation_id: allocRes.insertId, status: "allocated" }, { status: 201 });
    }

    if (action === "reject") {
      await conn.query(`UPDATE REQUEST SET status = 'rejected' WHERE request_id = ?`, [Number(request_id)]);
      await conn.commit();
      return NextResponse.json({ status: "rejected" });
    }

    if (action === "return") {
      await conn.query(
        `UPDATE ALLOCATION SET status = 'returned', returned_date = CURRENT_TIMESTAMP WHERE allocation_id = ?`,
        [Number(allocation_id)]
      );
      await conn.commit();
      return NextResponse.json({ allocation_id: Number(allocation_id), status: "returned" });
    }

    throw new Error("Unsupported action");
  } catch (err: any) {
    await conn.rollback();
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    conn.release();
  }
}