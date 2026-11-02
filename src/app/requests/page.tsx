"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/useAuth";

export default function RequestsPage() {
  const { user, loading, logout } = useAuth();
  const [clubId, setClubId] = useState("2");
  const [resourceId, setResourceId] = useState("1");
  const [purpose, setPurpose] = useState("Annual Technical Symposium Coverage");
  const [quantity, setQuantity] = useState("2");
  const [startTime, setStartTime] = useState("2026-11-03T06:00");
  const [endTime, setEndTime] = useState("2026-11-03T10:00");
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function checkConflict() {
    setMessage("");
    const params = new URLSearchParams({ resourceId, quantity, startTime, endTime });
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
      setMessage(`Request #${data.request.request_id} submitted for Resource #${targetResourceId}!`);
    } else {
      setMessage(`Database Validation Error: ${data.error}`);
    }
  }

  if (loading || !user) return null;

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Inter-Club Resource Reservation &amp; Conflict Detector</h1>
            <p>Powered by MySQL Stored Procedures (`sp_check_scheduling_conflict` &amp; `sp_suggest_alternative_resources`)</p>
          </div>
          <span className="badge badge-indigo">Logged in as {user.name} ({user.role})</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem", alignItems: "start" }}>
          <div className="card" style={{ display: "grid", gap: "1rem" }}>
            <h3>Reservation Request Form</h3>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Requesting Club</label>
              <select className="select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                <option value="1">1 - Photography Club</option>
                <option value="2">2 - Robotics Club</option>
                <option value="3">3 - Drama Society</option>
                <option value="4">4 - Music Club</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Resource to Borrow</label>
              <select className="select" value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
                <option value="1">#1 - Canon EOS 200D DSLR (Total: 2, 1 Allocated)</option>
                <option value="2">#2 - Sony Alpha A6400 Mirrorless (Total: 1)</option>
                <option value="3">#3 - Epson EX3260 Projector (Total: 2)</option>
                <option value="4">#4 - BenQ MW560 WXGA Projector (Total: 1)</option>
                <option value="5">#5 - Shure SM58 Dynamic Microphone (Total: 4)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Quantity Needed</label>
              <input className="input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Event Purpose</label>
              <input className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Start Window</label>
                <input className="input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>End Window</label>
                <input className="input" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button onClick={checkConflict} className="btn btn-secondary">
                1. Check Time Conflict
              </button>
              <button onClick={() => submitRequest()} className="btn btn-primary">
                2. Submit Request
              </button>
            </div>
            {message && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: message.startsWith("Database") ? "#fee2e2" : "#e0e7ff", color: message.startsWith("Database") ? "#991b1b" : "#1e1b4b", fontWeight: 600, fontSize: "0.9rem" }}>
                {message}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Intelligent Availability &amp; Alternatives</h3>
            {!conflictInfo ? (
              <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
                Click <strong>"1. Check Time Conflict"</strong> to run the MySQL conflict stored procedure for your selected time window.
              </p>
            ) : (
              <div>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: 10,
                    background: conflictInfo.conflict?.has_conflict ? "#fef2f2" : "#ecfdf5",
                    border: `1px solid ${conflictInfo.conflict?.has_conflict ? "#fecaca" : "#a7f3d0"}`,
                  }}
                >
                  <span className={conflictInfo.conflict?.has_conflict ? "badge badge-red" : "badge badge-green"}>
                    {conflictInfo.conflict?.has_conflict ? "Conflict Detected" : "Available"}
                  </span>
                  <p style={{ marginTop: "0.6rem", fontWeight: 600 }}>
                    {conflictInfo.conflict?.has_conflict
                      ? "Requested quantity exceeds available units during this time slot."
                      : "Sufficient units are free during your requested window."}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.25rem" }}>
                    Total Stock: {conflictInfo.conflict?.quantity_total} | Reserved in Window: {conflictInfo.conflict?.quantity_reserved} | Available: {conflictInfo.conflict?.quantity_available}
                  </p>
                </div>

                {conflictInfo.alternatives?.length > 0 && (
                  <div style={{ marginTop: "1.25rem" }}>
                    <h4 style={{ fontSize: "0.95rem", marginBottom: "0.6rem" }}>
                      Recommended Alternatives in Same Category:
                    </h4>
                    <div style={{ display: "grid", gap: "0.65rem" }}>
                      {conflictInfo.alternatives.map((alt: any) => (
                        <div
                          key={alt.resource_id}
                          style={{
                            padding: "0.85rem",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            background: "#f8fafc",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700 }}>{alt.resource_name}</div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                              {alt.owner_club_name} • {alt.location} • Free: {alt.available_qty}
                            </div>
                          </div>
                          <button
                            onClick={() => submitRequest(String(alt.resource_id))}
                            className="btn btn-success"
                            style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}
                          >
                            Reserve Alternative
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
