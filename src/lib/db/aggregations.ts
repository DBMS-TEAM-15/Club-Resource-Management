import clientPromise from "./mongodb";

const DB_NAME = "campus_club_resource_exchange";

export async function getMaintenanceSummaryByIssueType() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return db
    .collection("maintenance_logs")
    .aggregate([
      {
        $group: {
          _id: "$issue_type",
          count: { $sum: 1 },
          total_cost: { $sum: "$cost_incurred" },
          latest_event: { $max: "$created_at" },
        },
      },
      { $sort: { count: -1 } },
    ])
    .toArray();
}

export async function getResourceMaintenanceBreakdown() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return db
    .collection("maintenance_logs")
    .aggregate([
      {
        $lookup: {
          from: "resource_specs",
          localField: "resource_id",
          foreignField: "resource_id",
          as: "spec_info",
        },
      },
      { $unwind: { path: "$spec_info", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$resource_id",
          category_name: { $first: "$spec_info.category_name" },
          maintenance_events: { $sum: 1 },
          total_cost: { $sum: "$cost_incurred" },
          latest_condition: { $last: "$condition_after" },
        },
      },
      { $sort: { maintenance_events: -1 } },
    ])
    .toArray();
}