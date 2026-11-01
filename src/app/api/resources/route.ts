  import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const DB_NAME = "campus_club_resource_exchange";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const condition = searchParams.get("condition");
    const clubId = searchParams.get("clubId");
    const q = searchParams.get("q");
    const availableOnly = searchParams.get("availableOnly") === "true";

    const conditions: string[] = [];
    const values: any[] = [];

    if (categoryId) {
      conditions.push(`v.category_id = ?`);
      values.push(Number(categoryId));
    }
    if (condition) {
      conditions.push(`v.\`condition\` = ?`);
      values.push(condition);
    }
    if (clubId) {
      conditions.push(`v.owner_club_id = ?`);
      values.push(Number(clubId));
    }
    if (availableOnly) {
      conditions.push(`v.quantity_currently_available > 0`);
    }
    if (q) {
      conditions.push(`(MATCH(r.name, r.description, r.location) AGAINST(? IN NATURAL LANGUAGE MODE) OR v.resource_name LIKE ?)`);
      values.push(q, `%${q}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT v.*
      FROM vw_resource_availability v
      JOIN RESOURCE r ON r.resource_id = v.resource_id
      ${whereClause}
      ORDER BY v.resource_id ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql, values);

    let specsMap = new Map<number, any>();
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const specs = await db.collection("resource_specs").find({}).toArray();
      specs.forEach((s: any) => specsMap.set(Number(s.resource_id), s));
    } catch {
      // Fallback if MongoDB is offline in dev
    }

    const resources = rows.map((row) => ({
      ...row,
      mongo_specs: specsMap.get(Number(row.resource_id)) || null,
    }));

    return NextResponse.json({ resources });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      club_id,
      category_id,
      name,
      description,
      quantity_total,
      location,
      condition,
      specifications,
      accessories_included,
      usage_guidelines,
      tags,
    } = body;

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO RESOURCE (club_id, category_id, name, description, quantity_total, location, \`condition\`)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(club_id),
        Number(category_id),
        name,
        description,
        Number(quantity_total),
        location,
        condition || "good",
      ]
    );
    const resourceId = res.insertId;

    if (specifications) {
      const [catRows] = await pool.query<RowDataPacket[]>(
        `SELECT category_name FROM RESOURCE_CATEGORY WHERE category_id = ?`,
        [Number(category_id)]
      );
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      await db.collection("resource_specs").updateOne(
        { resource_id: Number(resourceId) },
        {
          $set: {
            resource_id: Number(resourceId),
            category_name: catRows[0]?.category_name || "General",
            specifications,
            accessories_included: accessories_included || [],
            usage_guidelines: usage_guidelines || "",
            tags: tags || [],
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ resource_id: resourceId, name }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}