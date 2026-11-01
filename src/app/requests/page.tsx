"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function RequestsPage() {
  const [clubId, setClubId] = useState("2");
  const [resourceId, setResourceId] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [startTime, setStartTime] = useState("2026-11-05T10:00");
  const [endTime, setEndTime] = useState("2026-11-05T14:00");
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function checkConflict() {
    const params = new URLSearchParams({
      resourceId,
      quantity,
      startTime,
      endTime,
    });
    const res = await fetch(`/api/requests/conflicts?${params.toString()}`);
    const data = await res.json();
    setConflictInfo(data);
  }

  async function submitRequest(targetResourceId = resourceId) {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        club_id: Number(clubId),
        resource_id: Number(targetResourceId),
        purpose,
        quantity_requested: Number(quantity),
        start_time: startTime,
        end_time: endTime,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Request #${data.request.request_id} created successfully!`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 850, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Request Resource & Conflict Detection</h1>
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 8, border: "1px solid #e5e7eb", marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
          <label>
            Requesting Club ID:
            <input value={clubId} onChange={(e) => setClubId(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Resource ID:
            <input value={resourceId} onChange={(e) => setResourceId(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Quantity Requested:
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Purpose:
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Event or workshop purpose" style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label style={{ flex: 1 }}>
              Start Time:
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
            </label>
            <label style={{ flex: 1 }}>
              End Time:
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
            </label>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={checkConflict} style={{ padding: "0.6rem 1rem", background: "#4b5563", color: "#fff", border: "none", borderRadius: 6 }}>
              Check Scheduling Conflict
            </button>
            <button onClick={() => submitRequest()} style={{ padding: "0.6rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}>
              Submit Request
            </button>
          </div>
          {message && <p style={{ fontWeight: 600 }}>{message}</p>}
        </div>

        {conflictInfo && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: 8, background: conflictInfo.conflict?.has_conflict ? "#fef2f2" : "#ecfdf5", border: "1px solid #d1d5db" }}>
            <h3>{conflictInfo.conflict?.has_conflict ? "Scheduling Conflict Detected!" : "No Conflict — Resource Available"}</h3>
            <p>Available Quantity in Window: {conflictInfo.conflict?.quantity_available}</p>
            {conflictInfo.alternatives?.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h4>Suggested Alternative Resources (Same Category):</h4>
                {conflictInfo.alternatives.map((alt: any) => (
                  <div key={alt.resource_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>
                    <span>{alt.resource_name} ({alt.owner_club_name}) — Available: {alt.available_qty}</span>
                    <button onClick={() => submitRequest(String(alt.resource_id))} style={{ padding: "0.3rem 0.75rem", background: "#059669", color: "#fff", border: "none", borderRadius: 4 }}>
                      Request This Instead
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

