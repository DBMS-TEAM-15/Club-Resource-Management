// ============================================================
// MongoDB Seed Data for resource_specs and maintenance_logs
// ============================================================

const database = db.getSiblingDB("campus_club_resource_exchange");

database.resource_specs.insertMany([
  {
    resource_id: Int32(1),
    category_name: "Camera",
    specifications: {
      sensor: "24.1MP APS-C CMOS",
      video_resolution: "1080p 60fps",
      iso_range: "100-25600",
      battery_life_shots: 650,
      mount: "Canon EF/EF-S"
    },
    accessories_included: ["18-55mm Lens", "50mm f/1.8 Lens", "64GB SDXC Card", "Dual Charger", "Padded Bag"],
    usage_guidelines: "Format SD card before returning. Do not expose lens sensor to direct stage lasers.",
    tags: ["dslr", "photography", "video", "canon"]
  },
  {
    resource_id: Int32(2),
    category_name: "Camera",
    specifications: {
      sensor: "24.2MP APS-C Exmor CMOS",
      video_resolution: "4K 30fps HDR",
      autofocus_points: 425,
      mount: "Sony E-mount"
    },
    accessories_included: ["16-50mm Power Zoom Lens", "DJI Ronin SC Gimbal", "2x NP-FW50 Batteries"],
    usage_guidelines: "Balance the gimbal prior to powering on motors.",
    tags: ["mirrorless", "4k", "sony", "gimbal"]
  },
  {
    resource_id: Int32(3),
    category_name: "Projector",
    specifications: {
      brightness_lumens: 3300,
      native_resolution: "SVGA (800x600)",
      ports: ["HDMI", "VGA", "USB-B"],
      lamp_hours_remaining: 4200
    },
    accessories_included: ["HDMI Cable (5m)", "Power Cord", "Remote Control"],
    usage_guidelines: "Allow cooling fan to run for 5 minutes before unplugging power cord.",
    tags: ["projector", "hdmi", "presentation", "epson"]
  },
  {
    resource_id: Int32(4),
    category_name: "Projector",
    specifications: {
      brightness_lumens: 4000,
      native_resolution: "WXGA (1280x800)",
      contrast_ratio: "20000:1",
      ports: ["2x HDMI", "VGA", "Audio Out"]
    },
    accessories_included: ["HDMI Cable (10m)", "Remote"],
    usage_guidelines: "Suitable for bright seminar rooms.",
    tags: ["projector", "wxga", "benq", "high-lumen"]
  },
  {
    resource_id: Int32(5),
    category_name: "Microphone",
    specifications: {
      polar_pattern: "Cardioid",
      frequency_response: "50Hz - 15kHz",
      connector: "3-pin XLR",
      impedance_ohms: 150
    },
    accessories_included: ["XLR Cable (6m)", "Mic Stand Clip", "Foam Windscreen"],
    usage_guidelines: "Do not drop or tap the grille forcefully.",
    tags: ["microphone", "vocal", "stage", "xlr", "shure"]
  }
]);

database.maintenance_logs.insertMany([
  {
    resource_id: Int32(1),
    reported_by_user_id: Int32(2),
    issue_type: "routine_check",
    notes: "Cleaned CMOS sensor and verified autofocus calibration after Robotics showcase.",
    condition_before: "good",
    condition_after: "excellent",
    checklist: { lens_clean: true, battery_health_ok: true, sd_slot_ok: true },
    cost_incurred: 0,
    created_at: new Date()
  },
  {
    resource_id: Int32(3),
    reported_by_user_id: Int32(5),
    issue_type: "cleaning",
    notes: "Replaced air filter mesh and cleaned projector optics.",
    condition_before: "fair",
    condition_after: "good",
    checklist: { air_filter_clean: true, hdmi_port_tested: true },
    cost_incurred: 250,
    created_at: new Date()
  }
]);