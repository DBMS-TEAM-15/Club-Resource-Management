// ============================================================
// MongoDB Seed Data for resource_specs, maintenance_logs, and user_credentials
// Uses non-destructive upserts so custom registered users & resources are preserved
// ============================================================

const database = db.getSiblingDB("campus_club_resource_exchange");

const seedUsers = [
  {
    user_id: Int32(1),
    name: "Aaryesh",
    email: "aaryesh@pes.edu",
    role: "student",
    roll_no: "PES2UG24CS191",
    password_hash: "scrypt:campus_club_salt_v1:a8f5f167f44f4964e6c998dee827110c",
    created_at: new Date()
  },
  {
    user_id: Int32(2),
    name: "Hemaksh",
    email: "hemaksh@pes.edu",
    role: "club_officer",
    club_role: "President - Robotics Club",
    password_hash: "scrypt:campus_club_salt_v1:d41d8cd98f00b204e9800998ecf8427e",
    created_at: new Date()
  },
  {
    user_id: Int32(4),
    name: "Satish",
    email: "satish@pes.edu",
    role: "admin",
    admin_level: "Super Admin",
    password_hash: "scrypt:campus_club_salt_v1:e99a18c428cb38d5f260853678922e03",
    created_at: new Date()
  }
];

seedUsers.forEach((u) => {
  database.user_credentials.replaceOne({ email: u.email }, u, { upsert: true });
});

const seedSpecs = [
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
  },
  {
    resource_id: Int32(6),
    category_name: "Microphone",
    specifications: {
      transmission_type: "2.4GHz Digital Wireless",
      range_meters: 200,
      battery_life: "7 hours",
      connectivity: "USB-C / 3.5mm TRS"
    },
    accessories_included: ["2x Transmitters", "1x Receiver", "2x Fur Windshields", "3x USB-C Cables"],
    usage_guidelines: "Charge both transmitters and receiver fully after recording sessions.",
    tags: ["wireless", "rode", "microphone", "lavalier"]
  },
  {
    resource_id: Int32(7),
    category_name: "Stage Space",
    specifications: {
      dimensions: "12m x 8m",
      lighting_rig: "DMX 24-Channel LED Par Cans",
      power_outlets: "6x 15A Industrial Sockets"
    },
    accessories_included: ["DMX Lighting Controller", "Stage Monitors", "Podium"],
    usage_guidelines: "Clear all props and cables immediately after rehearsal slot ends.",
    tags: ["stage", "auditorium", "lighting", "rehearsal"]
  },
  {
    resource_id: Int32(8),
    category_name: "Speaker System",
    specifications: {
      power_output: "400W (200W + 200W)",
      mixer_channels: "8-Channel Detachable Mixer",
      bluetooth: "Bluetooth 5.0 Audio Streaming",
      max_spl: "125 dB"
    },
    accessories_included: ["2x Speaker Stands", "2x 6m Speaker Cables", "Power Cable"],
    usage_guidelines: "Turn master volume down to zero before powering on or off.",
    tags: ["speaker", "pa-system", "yamaha", "mixer"]
  }
];

seedSpecs.forEach((s) => {
  database.resource_specs.replaceOne({ resource_id: s.resource_id }, s, { upsert: true });
});

if (database.maintenance_logs.countDocuments() === 0) {
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
}
