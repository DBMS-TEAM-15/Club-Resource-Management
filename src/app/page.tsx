"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/useAuth";

export default function CatalogPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [condition, setCondition] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [clubId, setClubId] = useState("1");
  const [categoryId, setCategoryId] = useState("1");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [resCondition, setResCondition] = useState("excellent");
  const [specPairs, setSpecPairs] = useState<{ key: string; value: string }[]>([
    { key: "resolution", value: "4K 60fps" },
    { key: "battery_life", value: "5 hours" },
  ]);
  const [accessoriesCsv, setAccessoriesCsv] = useState("Padded Carry Case, Power Cable");
  const [guidelines, setGuidelines] = useState("Return in original case after event.");
  const [statusMsg, setStatusMsg] = useState("");

  const canManageResources = user?.role === "club_officer" || user?.role === "admin";

  async function loadMeta() {
    const res = await fetch("/api/clubs");
    const data = await res.json();
    setClubs(data.clubs || []);
    setCategories(data.categories || []);
    if (data.clubs?.[0] && !clubId) setClubId(String(data.clubs[0].club_id));
    if (data.categories?.[0] && !categoryId) setCategoryId(String(data.categories[0].category_id));
  }

  async function loadResources() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (condition) params.set("condition", condition);
    if (availableOnly) params.set("availableOnly", "true");
    const res = await fetch(`/api/resources?${params.toString()}`);
    const data = await res.json();
    setResources(data.resources || []);
  }

  function updateSpecPair(index: number, field: "key" | "value", val: string) {
    const updated = [...specPairs];
    updated[index][field] = val;
    setSpecPairs(updated);
  }

  function addSpecPair() {
    setSpecPairs([...specPairs, { key: "", value: "" }]);
  }

  function removeSpecPair(index: number) {
    setSpecPairs(specPairs.filter((_, idx) => idx !== index));
  }

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    if (!canManageResources) return;
    setStatusMsg("");
    try {
      const specifications: Record<string, string> = {};
      for (const pair of specPairs) {
        if (pair.key.trim()) {
          specifications[pair.key.trim()] = pair.value.trim();
        }
      }
      const accessories = accessoriesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

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
          specifications,
          accessories_included: accessories,
          usage_guidelines: guidelines,
          tags: [resCondition, "club-asset"],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(
          `Saved "${name}" (Resource #${data.resource_id}) to BOTH MySQL (RESOURCE) and MongoDB (resource_specs)!`
        );
        setName("");
        setDescription("");
        setLocation("");
        await loadResources();
      } else {
        setStatusMsg(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  }

  useEffect(() => {
    if (user) {
      loadMeta();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadResources();
    }
  }, [user, categoryFilter, condition, availableOnly]);

  function conditionBadge(cond: string) {
    if (cond === "excellent") return "badge badge-green";
    if (cond === "good") return "badge badge-indigo";
    if (cond === "fair") return "badge badge-amber";
    return "badge badge-red";
  }

  if (loading || !user) return null;

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Campus Club Resource Catalog</h1>
            <p>
              Hybrid Inventory: Relational stock &amp; availability in MySQL + Schema-less technical specs in MongoDB
            </p>
          </div>
          {canManageResources ? (
            <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? "Close Form" : "+ Register New Resource"}
            </button>
          ) : (
            <span className="badge badge-indigo" style={{ padding: "0.45rem 0.9rem" }}>
              Student View (Can Browse &amp; Reserve Any Item)
            </span>
          )}
        </div>

        {canManageResources && showAdd && (
          <form onSubmit={handleAddResource} className="card" style={{ marginBottom: "1.75rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Register Club Resource (Writes to MySQL + MongoDB)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Owner Club (MySQL)</label>
                <select className="select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                  {clubs.map((c) => (
                    <option key={c.club_id} value={c.club_id}>
                      {c.club_id} - {c.club_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Category (MySQL + MongoDB)</label>
                <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_id} - {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Resource Name</label>
                <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Canon D500 DSLR" />
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
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Description (MySQL `RESOURCE`)</label>
                <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Camera body with kit lens attached" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Accessories Included (MongoDB Array)</label>
                <input className="input" value={accessoriesCsv} onChange={(e) => setAccessoriesCsv(e.target.value)} placeholder="Comma separated, e.g., Charger, SD Card, Case" />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Usage Guidelines (MongoDB `resource_specs`)</label>
              <input className="input" value={guidelines} onChange={(e) => setGuidelines(e.target.value)} />
            </div>

            <div style={{ marginTop: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: 10, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <label style={{ fontSize: "0.84rem", fontWeight: 700, color: "#3730a3" }}>
                  Flexible Technical Specifications (Stored in MongoDB `resource_specs`)
                </label>
                <button type="button" onClick={addSpecPair} className="btn btn-secondary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.78rem" }}>
                  + Add Spec Attribute
                </button>
              </div>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {specPairs.map((pair, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      className="input"
                      placeholder="Attribute (e.g., sensor, lumens)"
                      value={pair.key}
                      onChange={(e) => updateSpecPair(idx, "key", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Value (e.g., 24MP APS-C, 4000)"
                      value={pair.value}
                      onChange={(e) => updateSpecPair(idx, "value", e.target.value)}
                    />
                    {specPairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecPair(idx)}
                        className="btn btn-danger"
                        style={{ padding: "0.45rem 0.75rem", fontSize: "0.78rem" }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              <button type="submit" className="btn btn-primary">Save to MySQL &amp; MongoDB</button>
              {statusMsg && <span style={{ fontWeight: 600, color: statusMsg.startsWith("Error") ? "#dc2626" : "#059669" }}>{statusMsg}</span>}
            </div>
          </form>
        )}

        <div className="card" style={{ marginBottom: "1.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input"
            style={{ flex: 1, minWidth: 220 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Full-Text Search (e.g., Canon, Projector, XLR, Wireless)..."
          />
          <select
            className="select"
            style={{ width: 175 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          <select
            className="select"
            style={{ width: 175 }}
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

                {r.mongo_specs?.specifications && (
                  <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #cbd5e1" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                      MongoDB Technical Specs (`resource_specs`)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {Object.entries(r.mongo_specs.specifications).map(([k, v]) => (
                        <span key={k} className="badge badge-slate" style={{ textTransform: "none" }}>
                          {k}: {Array.isArray(v) ? v.join(", ") : String(v)}
                        </span>
                      ))}
                    </div>
                    {r.mongo_specs.accessories_included?.length > 0 && (
                      <div style={{ fontSize: "0.78rem", color: "#334155", marginTop: "0.45rem" }}>
                        <strong>Accessories:</strong> {r.mongo_specs.accessories_included.join(", ")}
                      </div>
                    )}
                    {r.mongo_specs.usage_guidelines && (
                      <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem", fontStyle: "italic" }}>
                        Note: {r.mongo_specs.usage_guidelines}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  {r.quantity_currently_available > 0 ? "Ready to borrow" : "Check time-slot conflicts"}
                </span>
                <button
                  type="button"
                  onClick={() => router.push(`/requests?resourceId=${r.resource_id}`)}
                  className="btn btn-primary"
                  style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}
                >
                  Reserve This Item &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
