"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Resource Catalog" },
    { href: "/requests", label: "Reserve & Check Conflicts" },
    { href: "/coordinator", label: "Coordinator & Maintenance" },
    { href: "/admin", label: "Admin Analytics" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(15, 23, 42, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0.85rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          CR
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", lineHeight: 1.1 }}>
            Campus Club Exchange
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
            MySQL + MongoDB Resource Allocation
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: active ? "#ffffff" : "#cbd5e1",
                background: active ? "rgba(99, 102, 241, 0.28)" : "transparent",
                border: active ? "1px solid rgba(129, 140, 248, 0.4)" : "1px solid transparent",
                padding: "0.45rem 0.9rem",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: active ? 600 : 500,
                transition: "all 0.15s",
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}