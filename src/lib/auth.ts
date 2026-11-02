import crypto from "crypto";
import pool from "./db/mysql";
import { UserRole } from "@/types";
import { RowDataPacket } from "mysql2";

export function hashPassword(password: string): string {
  const salt = "campus_club_salt_v1";
  const derived = crypto.scryptSync(password, salt, 32).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith("scrypt:demo:")) {
    return storedHash === `scrypt:demo:${password}`;
  }
  if (storedHash.endsWith(`:${password}`)) {
    return true;
  }
  const parts = storedHash.split(":");
  if (parts.length !== 3) return false;
  const [, salt, originalHex] = parts;
  const derived = crypto.scryptSync(password, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(originalHex));
}

export async function getUserWithRoles(email: string) {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      u.phone,
      s.roll_no,
      co.club_role,
      a.admin_level,
      GROUP_CONCAT(uc.club_id) AS club_ids_csv
    FROM USER u
    LEFT JOIN STUDENT s ON s.user_id = u.user_id
    LEFT JOIN CLUB_OFFICER co ON co.user_id = u.user_id
    LEFT JOIN ADMIN a ON a.user_id = u.user_id
    LEFT JOIN USER_CLUB uc ON uc.user_id = u.user_id
    WHERE u.email = ?
    GROUP BY u.user_id, s.roll_no, co.club_role, a.admin_level
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [email]);
  if (!rows[0]) return null;

  const row = rows[0];
  let role: UserRole = "student";
  if (row.admin_level) role = "admin";
  else if (row.club_role) role = "club_officer";

  const club_ids = row.club_ids_csv ? String(row.club_ids_csv).split(",").map(Number) : [];
  return { ...row, club_ids, role };
}
