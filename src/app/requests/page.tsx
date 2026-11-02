"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/useAuth";

export default function RequestsPage() {
  const { user, loading, logout } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  const [clubId, setClubId] = useState("2");
  const [resourceId, setResourceId] = useState("1");
  const [purpose, setPurpose] = useState("Annual Technical Symposium Coverage");
  const [quantity, setQuantity] = useState("1");
  const [startTime, setStartTime] = useState("2026-11-03T06:00");
  const [endTime, setEndTime] = useState("2026-11-03T10:00");
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function loadDynamicOptions() {
    const [clubsRes, resCatalog, reqList] = await Promise.all([
      fetch("/api/clubs"),
      fetch("/api/resources"),
      fetch("/api/requests"),
    ]);
    const clubsData = await clubsRes.json();
    const resData = await resCatalog.json();
    const reqData = await reqList.json();

    setClubs(clubsData.clubs || []);
    setResources(resData.resources || []);
    setMyRequests(reqData.requests || []);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const preselectedId = params.get("resourceId");
      if (preselectedId) {
        setResourceId(preselectedId);
      } else if (resData.resources?.[0]) {
        setResourceId(String(resData.resources[0].resource_id));
      }
    }
  }

  useEffect(() => {
    if (user) {
      if (user.club_ids?.[0]) {
        setClubId(String(user.club_ids[0]));
      }
      loadDynamicOptions();
    }
  }, [user]);

  async function checkConflict(targetId = resourceId) {
    setMessage("");
    const params = new URLSearchParams({
      resourceId: targetId,
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
      const selectedRes = resources.find((r) => Number(r.resource_id) === Number(targetResourceId));
      setMessage(
        `Request #${data.request.request_id} submitted for "${selectedRes?.resource_name || `Resource #${targetResourceId}`}"!`
      );
      loadDynamicOptions();
    } else {
      setMessage(`Database Validation Error: ${data.error}`);
    }
  }

  if (loading || !user) return null;

  const selectedResourceObj = resources.find((r) => String(r.resource_id) === String(resourceId));

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Inter-Club Resource Reservation &amp; Conflict Detector</h1>
            <p>Select any item from the live catalog to check time-slot availability or submit a borrow request</p>
          </div>
          <span className="badge badge-indigo">Logged in as {user.name} ({user.role})</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem", alignItems: "start" }}>
          <div className="card" style={{ display: "grid", gap: "1rem" }}>
            <h3>Reservation Request Form (Live Catalog Items)</h3>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Requesting Club</label>
              <select className="select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                {clubs.map((c) => (
                  <option key={c.club_id} value={c.club_id}>
                    #{c.club_id} — {c.club_name} ({c.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Resource to Borrow (Live from Catalog)</label>
              <select
                className="select"
                value={resourceId}
                onChange={(e) => {
                  setResourceId(e.target.value);
                  setConflictInfo(null);
                }}
              >
                {resources.map((r) => (
                  <option key={r.resource_id} value={r.resource_id}>
                    #{r.resource_id} — {r.resource_name} [{r.category_name}] (Owner: {r.owner_club_name} | Free: {r.quantity_currently_available}/{r.quantity_total})
                  </option>
                ))}
              </select>
            </div>

            {selectedResourceObj && (
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: 8, fontSize: "0.83rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <strong>Selected Item:</strong> {selectedResourceObj.resource_name} ({selectedResourceObj.condition}) — Location: {selectedResourceObj.location}
                </div>
                {selectedResourceObj.mongo_specs?.specifications && (
                  <div style={{ color: "#4f46e5", marginTop: 4 }}>
                    <strong>MongoDB Specs:</strong> {JSON.stringify(selectedResourceObj.mongo_specs.specifications)}
                  </div>
                )}
              </div>
            )}

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
              <button type="button" onClick={() => checkConflict()} className="btn btn-secondary">
                1. Check Time Conflict
              </button>
              <button type="button" onClick={() => submitRequest()} className="btn btn-primary">
                2. Submit Request
              </button>
            </div>
            {message && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: message.startsWith("Database") ? "#fee2e2" : "#d1fae5", color: message.startsWith("Database") ? "#991b1b" : "#065f46", fontWeight: 600, fontSize: "0.9rem" }}>
                {message}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Intelligent Availability &amp; Alternatives</h3>
            {!conflictInfo ? (
              <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
                Click <strong>"1. Check Time Conflict"</strong> to run the MySQL conflict stored procedure for your selected resource and time window.
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
                            <div style={{ fontWeight: 700 }}>#{alt.resource_id} — {alt.resource_name}</div>
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

        <div className="table-wrap" style={{ marginTop: "2rem" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>
            Recent Inter-Club Reservation Requests
          </div>
          <table>
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Resource</th>
                <th>Requesting Club</th>
                <th>Owner Club</th>
                <th>Qty</th>
                <th>Purpose</th>
                <th>Window</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r) => (
                <tr key={r.request_id}>
                  <td><strong>#{r.request_id}</strong></td>
                  <td>{r.resource_name}</td>
                  <td>{r.requesting_club_name}</td>
                  <td>{r.owner_club_name}</td>
                  <td>{r.quantity_requested}</td>
                  <td>{r.purpose}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {new Date(r.start_time).toLocaleString()} &rarr; {new Date(r.end_time).toLocaleString()}
                  </td>
                  <td>
                    <span className={r.status === "approved" ? "badge badge-green" : r.status === "rejected" ? "badge badge-red" : "badge badge-amber"}>
                      {r.status}
                    </span>
                    {r.allocation_status && (
                      <span className="badge badge-indigo" style={{ marginLeft: 6 }}>
                        {r.allocation_status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
