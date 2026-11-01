"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        Campus Club Resource Exchange
      </div>
      <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.95rem" }}>
        <Link href="/" style={{ color: "#e5e7eb", textDecoration: "none" }}>Catalog</Link>
        <Link href="/requests" style={{ color: "#e5e7eb", textDecoration: "none" }}>Requests & Conflicts</Link>
        <Link href="/coordinator" style={{ color: "#e5e7eb", textDecoration: "none" }}>Coordinator Portal</Link>
        <Link href="/admin" style={{ color: "#e5e7eb", textDecoration: "none" }}>Admin Analytics</Link>
      </div>
    </nav>
  );
}