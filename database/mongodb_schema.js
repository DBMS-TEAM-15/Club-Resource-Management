// ============================================================
// MongoDB Collections, JSON Schema Validation & Indexes
// Run with: mongosh "$MONGODB_URI" database/mongodb_schema.js
// ============================================================

const dbName = "campus_club_resource_exchange";
const database = db.getSiblingDB(dbName);

const existingCollections = database.getCollectionNames();

const resourceSpecsValidator = {
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
};

if (!existingCollections.includes("resource_specs")) {
  database.createCollection("resource_specs", { validator: resourceSpecsValidator });
} else {
  database.runCommand({ collMod: "resource_specs", validator: resourceSpecsValidator });
}

database.resource_specs.createIndex({ resource_id: 1 }, { unique: true });
database.resource_specs.createIndex({ category_name: 1 });
database.resource_specs.createIndex({ tags: 1 });
database.resource_specs.createIndex({ usage_guidelines: "text", category_name: "text" });

const maintenanceLogsValidator = {
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
};

if (!existingCollections.includes("maintenance_logs")) {
  database.createCollection("maintenance_logs", { validator: maintenanceLogsValidator });
} else {
  database.runCommand({ collMod: "maintenance_logs", validator: maintenanceLogsValidator });
}

database.maintenance_logs.createIndex({ resource_id: 1, created_at: -1 });
database.maintenance_logs.createIndex({ issue_type: 1 });

if (!existingCollections.includes("user_credentials")) {
  database.createCollection("user_credentials");
}
database.user_credentials.createIndex({ email: 1 }, { unique: true });
database.user_credentials.createIndex({ user_id: 1 });
