import pool from "./mysql";
import { RowDataPacket } from "mysql2";

export async function getFrequentlyRequestedResources() {
  const sql = `
    SELECT
      r.resource_id,
      r.name AS resource_name,
      c.club_name AS owner_club,
      cat.category_name,
      COUNT(req.request_id) AS request_count,
      COALESCE(SUM(req.quantity_requested), 0) AS total_units_requested
    FROM RESOURCE r
    JOIN CLUB c ON c.club_id = r.club_id
    JOIN RESOURCE_CATEGORY cat ON cat.category_id = r.category_id
    JOIN REQUEST req ON req.resource_id = r.resource_id
    GROUP BY r.resource_id, r.name, c.club_name, cat.category_name
    HAVING COUNT(req.request_id) >= 1
    ORDER BY request_count DESC, total_units_requested DESC
  `;
  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows;
}

export async function getInterClubBorrowingPatterns() {
  const sql = `
    SELECT
      borrower.club_name AS borrowing_club,
      lender.club_name AS lending_club,
      COUNT(req.request_id) AS total_exchanges,
      SUM(CASE WHEN req.status = 'approved' THEN 1 ELSE 0 END) AS approved_exchanges
    FROM REQUEST req
    JOIN CLUB borrower ON borrower.club_id = req.club_id
    JOIN RESOURCE r ON r.resource_id = req.resource_id
    JOIN CLUB lender ON lender.club_id = r.club_id
    WHERE req.club_id <> r.club_id
    GROUP BY borrower.club_name, lender.club_name
    ORDER BY total_exchanges DESC
  `;
  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows;
}

export async function getUnderutilizedAndClubSummary() {
  const [underutilized] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM vw_underutilized_assets ORDER BY lifetime_request_count ASC`
  );
  const [clubUtilization] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM vw_club_utilization_summary ORDER BY total_requests_made DESC`
  );
  return { underutilized, clubUtilization };
}
