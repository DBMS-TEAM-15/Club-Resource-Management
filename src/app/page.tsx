"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CatalogPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // New resource form state
  const [clubId, setClubId] = useState("1");
  const [categoryId, setCategoryId] = useState("1");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [resCondition, setResCondition] = useState("excellent");
  const [specsJson, setSpecsJson] = useState('{"resolution": "4K", "battery_life": "5 hours"}');
  const [guidelines, setGuidelines] = useState("Return in padded case after event.");
  const [statusMsg, setStatusMsg] = useState("");

  async function loadResources() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (condition) params.set("condition", condition);
    if (availableOnly) params.set("availableOnly", "true");
    const res = await fetch(`/api/resources?${params.toString()}`);
    const data = await res.json();
    setResources(data.resources || []);
  }

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");
    try {
      const parsedSpecs = JSON.parse(specsJson || "{}");
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_id: Number(clubId),
          category_id: Number(categoryId),
          name,
          description,
          quantity_total: Number(qty),
          location,
          condition: resCondition,
          specifications: parsedSpecs,
          usage_guidelines: guidelines,
          tags: [resCondition, "club-asset"],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Added "${name}" (Resource #${data.resource_id}) to MySQL & MongoDB!`);
        setName("");
        setDescription("");
        setLocation("");
        loadResources();
      } else {
        setStatusMsg(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Invalid JSON in specifications: ${err.message}`);
    }
  }

  useEffect(() => {
    loadResources();
  }, [condition, availableOnly]);

  function conditionBadge(cond: string) {
    if (cond === "excellent") return "badge badge-green";
    if (cond === "good") return "badge badge-indigo";
    if (cond === "fair") return "badge badge-amber";
    return "badge badge-red";
  }

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Campus Club Resource Catalog</h1>
            <p>
              Hybrid Inventory: Relational stock & availability in MySQL + Schema-less technical specs in MongoDB
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? "Close Form" : "+ Register New Resource"}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddResource} className="card" style={{ marginBottom: "1.75rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Register Club Resource (Writes to MySQL + MongoDB)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Owner Club</label>
                <select className="select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                  <option value="1">1 - Photography Club</option>
                  <option value="2">2 - Robotics Club</option>
                  <option value="3">3 - Drama Society</option>
                  <option value="4">4 - Music Club</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Category</label>
                <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="1">1 - Camera</option>
                  <option value="2">2 - Projector</option>
                  <option value="3">3 - Microphone</option>
                  <option value="4">4 - Event Space</option>
                  <option value="5">5 - Lighting & Audio</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Resource Name</label>
                <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Godox SL60W LED Light" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Total Quantity</label>
                <input className="input" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Storage Location</label>
                <input className="input" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Media Room B3" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Condition</label>
                <select className="select" value={resCondition} onChange={(e) => setResCondition(e.target.value)}>
                  <option value="excellent">excellent</option>
                  <option value="good">good</option>
                  <option value="fair">fair</option>
                  <option value="needs_maintenance">needs_maintenance</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Description (MySQL)</label>
                <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the equipment" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Usage Guidelines (MongoDB)</label>
                <input className="input" value={guidelines} onChange={(e) => setGuidelines(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Flexible Technical Specifications JSON (MongoDB `resource_specs`)</label>
              <input className="input" value={specsJson} onChange={(e) => setSpecsJson(e.target.value)} />
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              <button type="submit" className="btn btn-primary">Save Resource</button>
              {statusMsg && <span style={{ fontWeight: 600, color: "#4338ca" }}>{statusMsg}</span>}
            </div>
          </form>
        )}

        <div className="card" style={{ marginBottom: "1.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input"
            style={{ flex: 1, minWidth: 240 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Full-Text Search (e.g., Canon, Projector, XLR, Wireless)..."
          />
          <select
            className="select"
            style={{ width: 190 }}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs_maintenance">Needs Maintenance</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", cursor: "pointer" }}>
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
            Available Only
          </label>
          <button onClick={loadResources} className="btn btn-primary">
            Search Inventory
          </button>
        </div>

        <div className="grid-cards">
          {resources.map((r) => (
            <div key={r.resource_id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>ID #{r.resource_id}</span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{r.resource_name}</h3>
                  </div>
                  <span className="badge badge-indigo">{r.category_name}</span>
                </div>

                <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>{r.description}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.84rem", background: "#f8fafc", padding: "0.75rem", borderRadius: 8 }}>
                  <div><span style={{ color: "#64748b" }}>Owner:</span> <strong>{r.owner_club_name}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Room:</span> <strong>{r.location}</strong></div>
                  <div>
                    <span style={{ color: "#64748b" }}>Condition: </span>
                    <span className={conditionBadge(r.condition)}>{r.condition}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Stock: </span>
                    <strong style={{ color: r.quantity_currently_available > 0 ? "#059669" : "#dc2626" }}>
                      {r.quantity_currently_available} / {r.quantity_total} free
                    </strong>
                  </div>
                </div>
              </div>

              {r.mongo_specs?.specifications && (
                <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #cbd5e1" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    MongoDB Technical Specs
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {Object.entries(r.mongo_specs.specifications).map(([k, v]) => (
                      <span key={k} className="badge badge-slate" style={{ textTransform: "none" }}>
                        {k}: {Array.isArray(v) ? v.join(", ") : String(v)}
                      </span>
                    ))}
                  </div>
                  {r.mongo_specs.usage_guidelines && (
                    <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.5rem", fontStyle: "italic" }}>
                      Note: {r.mongo_specs.usage_guidelines}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
