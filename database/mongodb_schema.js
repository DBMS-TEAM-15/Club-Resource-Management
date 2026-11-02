// ============================================================
// MongoDB Collections, JSON Schema Validation & Indexes
// Run with: mongosh "$MONGODB_URI" database/mongodb_schema.js
// ============================================================

const dbName = "campus_club_resource_exchange";
const database = db.getSiblingDB(dbName);

database.resource_specs.drop();
database.maintenance_logs.drop();

database.createCollection("resource_specs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resource_id", "category_name", "specifications"],
      properties: {
        resource_id: {
          bsonType: ["int", "long", "double"],
          description: "References MySQL RESOURCE.resource_id"
        },
        category_name: { bsonType: "string" },
        specifications: {
          bsonType: "object",
          description: "Flexible schema-less key-value attributes specific to asset type"
        },
        accessories_included: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        usage_guidelines: { bsonType: "string" },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        }
      }
    }
  }
});

database.resource_specs.createIndex({ resource_id: 1 }, { unique: true });
database.resource_specs.createIndex({ category_name: 1 });
database.resource_specs.createIndex({ tags: 1 });
database.resource_specs.createIndex({ usage_guidelines: "text", category_name: "text" });

database.createCollection("maintenance_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resource_id", "reported_by_user_id", "issue_type", "condition_after", "created_at"],
      properties: {
        resource_id: { bsonType: ["int", "long", "double"] },
        reported_by_user_id: { bsonType: ["int", "long", "double"] },
        issue_type: {
          enum: ["routine_check", "repair", "damage_report", "calibration", "cleaning"]
        },
        notes: { bsonType: "string" },
        condition_before: { bsonType: "string" },
        condition_after: {
          enum: ["excellent", "good", "fair", "needs_maintenance"]
        },
        checklist: { bsonType: "object" },
        cost_incurred: { bsonType: ["double", "int", "long"] },
        created_at: { bsonType: "date" }
      }
    }
  }
});

database.maintenance_logs.createIndex({ resource_id: 1, created_at: -1 });
database.maintenance_logs.createIndex({ issue_type: 1 });
