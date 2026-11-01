"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CoordinatorPortal() {
  const [requests, setRequests] = useState<any[]>([]);

  async function loadRequests() {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data.requests || []);
  }

  async function handleAction(action: string, requestId: number, allocationId?: number) {
    await fetch("/api/allocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, request_id: requestId, allocation_id: allocationId, approved_by: 4 }),
    });
    loadRequests();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Coordinator Approval & Return Portal</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={{ padding: "0.75rem" }}>ID</th>
              <th style={{ padding: "0.75rem" }}>Resource</th>
              <th style={{ padding: "0.75rem" }}>Borrowing Club</th>
              <th style={{ padding: "0.75rem" }}>Qty</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.request_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.75rem" }}>#{r.request_id}</td>
                <td style={{ padding: "0.75rem" }}>{r.resource_name}</td>
                <td style={{ padding: "0.75rem" }}>{r.requesting_club_name}</td>
                <td style={{ padding: "0.75rem" }}>{r.quantity_requested}</td>
                <td style={{ padding: "0.75rem" }}>{r.status} {r.allocation_status ? `(${r.allocation_status})` : ""}</td>
                <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => handleAction("approve", r.request_id)} style={{ padding: "0.35rem 0.7rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4 }}>
                        Approve
                      </button>
                      <button onClick={() => handleAction("reject", r.request_id)} style={{ padding: "0.35rem 0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 4 }}>
                        Reject
                      </button>
                    </>
                  )}
                  {r.allocation_status === "allocated" && (
                    <button onClick={() => handleAction("return", r.request_id, r.allocation_id)} style={{ padding: "0.35rem 0.7rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}>
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
