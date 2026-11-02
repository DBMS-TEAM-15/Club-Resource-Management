"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/useAuth";

interface NavbarProps {
  user?: SessionUser | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();

  const allLinks = [
    { href: "/", label: "Resource Catalog", roles: ["student", "club_officer", "admin"] },
    { href: "/requests", label: "Reserve & Check Conflicts", roles: ["student", "club_officer", "admin"] },
    { href: "/coordinator", label: "Coordinator & Maintenance", roles: ["club_officer", "admin"] },
    { href: "/admin", label: "Admin Analytics", roles: ["admin"] },
  ];

  const visibleLinks = user
    ? allLinks.filter((l) => l.roles.includes(user.role))
    : allLinks;

  function roleLabel(role?: string) {
    if (role === "admin") return { text: "ADMIN", bg: "#fef3c7", color: "#92400e" };
    if (role === "club_officer") return { text: "CLUB MANAGER", bg: "#d1fae5", color: "#065f46" };
    return { text: "STUDENT", bg: "#e0e7ff", color: "#3730a3" };
  }

  const badge = roleLabel(user?.role);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(15, 23, 42, 0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0.85rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
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

      <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {visibleLinks.map((l) => {
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

      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: "0.86rem", fontWeight: 600 }}>{user.name}</div>
            <span
              style={{
                display: "inline-block",
                padding: "1px 8px",
                borderRadius: 999,
                fontSize: "0.68rem",
                fontWeight: 700,
                background: badge.bg,
                color: badge.color,
              }}
            >
              {badge.text}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="btn"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#f8fafc",
              padding: "0.42rem 0.85rem",
              fontSize: "0.8rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Switch Role / Logout
          </button>
        </div>
      ) : (
        <Link href="/login" className="btn btn-primary" style={{ textDecoration: "none", fontSize: "0.84rem" }}>
          Sign In
        </Link>
      )}
    </header>
  );
}
