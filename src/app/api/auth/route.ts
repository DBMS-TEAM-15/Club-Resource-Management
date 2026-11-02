import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { Int32 } from "mongodb";
import { getUserWithRoles, hashPassword, verifyPassword } from "@/lib/auth";
import { ResultSetHeader } from "mysql2";

const DB_NAME = "campus_club_resource_exchange";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      name,
      email,
      password,
      phone,
      roleType,
      rollNo,
      clubRole,
      adminLevel,
      clubId,
    } = body;

    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required" },
          { status: 400 }
        );
      }

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const passwordHash = hashPassword(password);
        const [userRes] = await conn.query<ResultSetHeader>(
          `INSERT INTO USER (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
          [name.trim(), email.trim().toLowerCase(), passwordHash, phone || null]
        );
        const userId = Number(userRes.insertId);

        const resolvedRole = roleType || "student";
        if (resolvedRole === "club_officer") {
          await conn.query(
            `INSERT INTO CLUB_OFFICER (user_id, club_role) VALUES (?, ?)`,
            [userId, clubRole || "Club Coordinator"]
          );
        } else if (resolvedRole === "admin") {
          await conn.query(
            `INSERT INTO ADMIN (user_id, admin_level) VALUES (?, ?)`,
            [userId, adminLevel || "System Admin"]
          );
        } else {
          await conn.query(
            `INSERT INTO STUDENT (user_id, roll_no) VALUES (?, ?)`,
            [userId, rollNo || `PES-${userId}`]
          );
        }

        if (clubId) {
          await conn.query(
            `INSERT IGNORE INTO USER_CLUB (user_id, club_id) VALUES (?, ?)`,
            [userId, Number(clubId)]
          );
        }

        await conn.commit();

        const mongoClient = await clientPromise;
        const db = mongoClient.db(DB_NAME);
        const credentialDoc: Record<string, any> = {
          user_id: new Int32(userId),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone || null,
          role: resolvedRole,
          club_id: clubId ? new Int32(Number(clubId)) : null,
          password_hash: passwordHash,
          created_at: new Date(),
        };

        if (resolvedRole === "student") {
          credentialDoc.roll_no = rollNo || `PES-${userId}`;
        } else if (resolvedRole === "club_officer") {
          credentialDoc.club_role = clubRole || "Club Coordinator";
        } else if (resolvedRole === "admin") {
          credentialDoc.admin_level = adminLevel || "System Admin";
        }

        await db
          .collection("user_credentials")
          .replaceOne({ email: email.trim().toLowerCase() }, credentialDoc, {
            upsert: true,
          });

        const createdUser = await getUserWithRoles(email.trim().toLowerCase());
        const { password_hash, ...safeCreated } = createdUser!;
        return NextResponse.json(
          {
            user: safeCreated,
            password_hash: passwordHash,
            mongo_saved: true,
            mongo_credential: credentialDoc,
          },
          { status: 201 }
        );
      } catch (err: any) {
        await conn.rollback();
        return NextResponse.json({ error: err.message }, { status: 400 });
      } finally {
        conn.release();
      }
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await getUserWithRoles(normalizedEmail);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      await db.collection("user_credentials").updateOne(
        { email: normalizedEmail },
        {
          $setOnInsert: {
            user_id: new Int32(Number(user.user_id)),
            name: user.name,
            email: user.email,
            role: user.role,
            password_hash: user.password_hash,
            created_at: new Date(),
          },
        },
        { upsert: true }
      );
    } catch {
      // Non-blocking on login
    }

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
