"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CatalogPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState("");

  async function loadResources() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (condition) params.set("condition", condition);
    const res = await fetch(`/api/resources?${params.toString()}`);
    const data = await res.json();
    setResources(data.resources || []);
  }

  useEffect(() => {
    loadResources();
  }, [condition]);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Club Resource Catalog</h1>
        <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
          Search structured MySQL inventory alongside flexible MongoDB technical specifications.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Full-text search resources (e.g., Canon, Projector, XLR)..."
            style={{ flex: 1, padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: 6 }}
          />
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: 6 }}
          >
            <option value="">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs_maintenance">Needs Maintenance</option>
          </select>
          <button
            onClick={loadResources}
            style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}
          >
            Search
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {resources.map((r) => (
            <div
              key={r.resource_id}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>{r.resource_name}</strong>
                <span style={{ fontSize: "0.8rem", background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12 }}>
                  {r.category_name}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.75rem" }}>{r.description}</p>
              <div style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>
                <div><strong>Owner Club:</strong> {r.owner_club_name}</div>
                <div><strong>Location:</strong> {r.location}</div>
                <div><strong>Condition:</strong> {r.condition}</div>
                <div><strong>Available:</strong> {r.quantity_currently_available} / {r.quantity_total}</div>
              </div>
              {r.mongo_specs?.specifications && (
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed #e5e7eb", fontSize: "0.8rem" }}>
                  <strong>MongoDB Technical Specs:</strong>
                  <pre style={{ marginTop: 4, whiteSpace: "pre-wrap", color: "#374151" }}>
                    {JSON.stringify(r.mongo_specs.specifications, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}