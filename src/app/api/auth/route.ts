import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { getUserWithRoles, hashPassword, verifyPassword } from "@/lib/auth";
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, email, password, phone, roleType, rollNo, clubRole, clubId } = body;

    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
      }
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const passwordHash = hashPassword(password);
        const [userRes] = await conn.query<ResultSetHeader>(
          `INSERT INTO USER (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
          [name, email, passwordHash, phone || null]
        );
        const userId = userRes.insertId;

        if (roleType === "club_officer") {
          await conn.query(`INSERT INTO CLUB_OFFICER (user_id, club_role) VALUES (?, ?)`, [
            userId,
            clubRole || "Coordinator",
          ]);
        } else if (roleType === "admin") {
          await conn.query(`INSERT INTO ADMIN (user_id, admin_level) VALUES (?, ?)`, [userId, "System Admin"]);
        } else {
          await conn.query(`INSERT INTO STUDENT (user_id, roll_no) VALUES (?, ?)`, [
            userId,
            rollNo || `PES-${userId}`,
          ]);
        }

        if (clubId) {
          await conn.query(`INSERT IGNORE INTO USER_CLUB (user_id, club_id) VALUES (?, ?)`, [
            userId,
            Number(clubId),
          ]);
        }

        await conn.commit();
        const createdUser = await getUserWithRoles(email);
        return NextResponse.json({ user: createdUser }, { status: 201 });
      } catch (err: any) {
        await conn.rollback();
        return NextResponse.json({ error: err.message }, { status: 400 });
      } finally {
        conn.release();
      }
    }

    const user = await getUserWithRoles(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
