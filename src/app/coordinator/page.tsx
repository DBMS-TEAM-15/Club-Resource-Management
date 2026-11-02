"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/useAuth";

export default function CoordinatorPortal() {
  const { user, loading, isAuthorized, logout } = useAuth(["club_officer", "admin"]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [actionMsg, setActionMsg] = useState("");

  const [resId, setResId] = useState("1");
  const [issueType, setIssueType] = useState("routine_check");
  const [condAfter, setCondAfter] = useState("excellent");
  const [cost, setCost] = useState("0");
  const [notes, setNotes] = useState("");

  async function loadAll() {
    const [reqRes, notifRes] = await Promise.all([
      fetch("/api/requests"),
      fetch(`/api/maintenance?userId=2`),
    ]);
    const reqData = await reqRes.json();
    const notifData = await notifRes.json();
    setRequests(reqData.requests || []);
    setNotifications(notifData.notifications || []);
  }

  async function handleAction(action: string, requestId: number, allocationId?: number) {
    setActionMsg("");
    const res = await fetch("/api/allocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        request_id: requestId,
        allocation_id: allocationId,
        approved_by: user?.user_id || 4,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setActionMsg(`Trigger / Transaction Rejected: ${data.error}`);
    } else {
      setActionMsg(`Success: Request #${requestId} updated (${action}). Auto-notification trigger fired!`);
    }
    loadAll();
  }

  async function handleLogMaintenance(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resource_id: Number(resId),
        reported_by_user_id: user?.user_id || 2,
        issue_type: issueType,
        condition_after: condAfter,
        cost_incurred: Number(cost),
        notes,
      }),
    });
    setNotes("");
    setActionMsg(`Maintenance event recorded in MongoDB & synced condition to '${condAfter}' in MySQL!`);
    loadAll();
  }

  useEffect(() => {
    if (user && isAuthorized) {
      loadAll();
    }
  }, [user, isAuthorized]);

  if (loading || !user) return null;

  if (!isAuthorized) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <main className="container">
          <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
            <span className="badge badge-red">RBAC Access Restricted</span>
            <h2 style={{ marginTop: "0.75rem" }}>Club Manager or Admin Role Required</h2>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
              You are currently signed in as <strong>{user.name}</strong> (Role: <code>{user.role}</code>). Only users in the <code>CLUB_OFFICER</code> or <code>ADMIN</code> tables can approve requests, process returns, or log equipment maintenance.
            </p>
            <button onClick={logout} className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
              Switch to Club Manager or Admin Account
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Coordinator Approval, Return &amp; Maintenance Portal</h1>
            <p>ACID Transactions, MySQL Stock/Notification Triggers &amp; MongoDB Maintenance Logs</p>
          </div>
          <span className="badge badge-green">{user.club_role || user.admin_level || "Coordinator"}</span>
        </div>

        {actionMsg && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "0.9rem 1.2rem",
              borderRadius: 10,
              fontWeight: 600,
              background: actionMsg.startsWith("Trigger") ? "#fee2e2" : "#d1fae5",
              color: actionMsg.startsWith("Trigger") ? "#991b1b" : "#065f46",
            }}
          >
            {actionMsg}
          </div>
        )}

        <div className="table-wrap" style={{ marginBottom: "2rem" }}>
          <table>
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Resource</th>
                <th>Borrowing Club</th>
                <th>Owner Club</th>
                <th>Qty</th>
                <th>Time Window</th>
                <th>Status</th>
                <th>Coordinator Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.request_id}>
                  <td><strong>#{r.request_id}</strong></td>
                  <td>{r.resource_name}</td>
                  <td>{r.requesting_club_name}</td>
                  <td>{r.owner_club_name}</td>
                  <td>{r.quantity_requested}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {new Date(r.start_time).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={
                        r.status === "approved"
                          ? "badge badge-green"
                          : r.status === "rejected"
                          ? "badge badge-red"
                          : "badge badge-amber"
                      }
                    >
                      {r.status}
                    </span>
                    {r.allocation_status && (
                      <span className="badge badge-indigo" style={{ marginLeft: 6 }}>
                        {r.allocation_status}
                      </span>
                    )}
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    {r.status === "pending" && (
                      <>
                        <button onClick={() => handleAction("approve", r.request_id)} className="btn btn-success" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                          Approve
                        </button>
                        <button onClick={() => handleAction("reject", r.request_id)} className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                          Reject
                        </button>
                      </>
                    )}
                    {r.allocation_status === "allocated" && (
                      <button onClick={() => handleAction("return", r.request_id, r.allocation_id)} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                        Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <form onSubmit={handleLogMaintenance} className="card" style={{ display: "grid", gap: "0.85rem" }}>
            <h3>Log Equipment Maintenance (MongoDB + MySQL Condition Sync)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Resource ID</label>
                <input className="input" type="number" value={resId} onChange={(e) => setResId(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Issue Type</label>
                <select className="select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                  <option value="routine_check">routine_check</option>
                  <option value="cleaning">cleaning</option>
                  <option value="repair">repair</option>
                  <option value="damage_report">damage_report</option>
                  <option value="calibration">calibration</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Condition After</label>
                <select className="select" value={condAfter} onChange={(e) => setCondAfter(e.target.value)}>
                  <option value="excellent">excellent</option>
                  <option value="good">good</option>
                  <option value="fair">fair</option>
                  <option value="needs_maintenance">needs_maintenance</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cost Incurred (Rs.)</label>
                <input className="input" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Inspection / Repair Notes</label>
              <input className="input" required value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cleaned lens, tested HDMI port..." />
            </div>
            <button type="submit" className="btn btn-primary">Record Maintenance Log</button>
          </form>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Trigger-Generated Notifications (`NOTIFICATION` Table)</h3>
            <div style={{ display: "grid", gap: "0.6rem", maxHeight: 280, overflowY: "auto" }}>
              {notifications.map((n) => (
                <div key={n.notification_id} style={{ padding: "0.7rem", background: "#f8fafc", borderRadius: 8, borderLeft: "4px solid #4f46e5", fontSize: "0.86rem" }}>
                  <div>{n.message}</div>
                  <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: 4 }}>
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
