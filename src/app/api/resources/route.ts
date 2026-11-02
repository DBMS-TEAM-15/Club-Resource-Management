import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { Int32 } from "mongodb";
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
      conditions.push(
        `(MATCH(r.name, r.description, r.location) AGAINST(? IN NATURAL LANGUAGE MODE) OR v.resource_name LIKE ? OR v.category_name LIKE ?)`
      );
      values.push(q, `%${q}%`, `%${q}%`);
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

    const specsMap = new Map<number, any>();
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const specs = await db.collection("resource_specs").find({}).toArray();
      specs.forEach((s: any) => specsMap.set(Number(s.resource_id), s));
    } catch {
      // Fallback if MongoDB is offline
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
    const resourceId = Number(res.insertId);

    const [catRows] = await pool.query<RowDataPacket[]>(
      `SELECT category_name FROM RESOURCE_CATEGORY WHERE category_id = ?`,
      [Number(category_id)]
    );
    const categoryName = catRows[0]?.category_name || "General";

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const specDoc = {
      resource_id: new Int32(resourceId),
      category_name: String(categoryName),
      specifications:
        specifications && typeof specifications === "object"
          ? specifications
          : { status: "standard" },
      accessories_included: Array.isArray(accessories_included)
        ? accessories_included.map(String)
        : [],
      usage_guidelines: String(usage_guidelines || "Handle with care and return on time."),
      tags: Array.isArray(tags) ? tags.map(String) : [String(condition || "good")],
    };

    await db.collection("resource_specs").replaceOne(
      { resource_id: resourceId },
      specDoc,
      { upsert: true }
    );

    return NextResponse.json(
      {
        resource_id: resourceId,
        name,
        mongo_saved: true,
        mongo_specs: specDoc,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
