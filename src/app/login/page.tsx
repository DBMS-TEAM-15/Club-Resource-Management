"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setStoredUser } from "@/lib/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roleType, setRoleType] = useState<"student" | "club_officer" | "admin">("student");
  const [rollNo, setRollNo] = useState("");
  const [clubRole, setClubRole] = useState("Coordinator - Photography Club");
  const [clubId, setClubId] = useState("1");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email,
          password,
          name,
          phone,
          roleType,
          rollNo,
          clubRole,
          clubId: Number(clubId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setSubmitting(false);
        return;
      }
      setStoredUser(data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  async function quickLogin(demoEmail: string, demoPassword: string) {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: demoEmail, password: demoPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Quick login failed");
        setSubmitting(false);
        return;
      }
      setStoredUser(data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: 960, width: "100%", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "1.75rem", alignItems: "stretch" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%)",
            color: "#fff",
            padding: "2.25rem",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 16px 35px -10px rgba(49, 46, 129, 0.45)",
          }}
        >
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: "1rem" }}>Role-Based Access Control (RBAC)</span>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Campus Club Resource Exchange &amp; Allocation System
            </h1>
            <p style={{ color: "#c7d2fe", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Sign in with your campus account. Your permissions across the platform are resolved from the MySQL ISA role hierarchy (<code>STUDENT</code>, <code>CLUB_OFFICER</code>, <code>ADMIN</code>).
            </p>

            <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.86rem" }}>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "0.8rem 1rem", borderRadius: 10 }}>
                <strong style={{ color: "#a5b4fc" }}>1. Student Role (Club Member)</strong>
                <div style={{ color: "#e0e7ff" }}>Can browse &amp; search the hybrid catalog, check time-window conflicts, and submit resource borrow requests.</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "0.8rem 1rem", borderRadius: 10 }}>
                <strong style={{ color: "#6ee7b7" }}>2. Club Manager Role (Coordinator)</strong>
                <div style={{ color: "#e0e7ff" }}>Can register new club resources, approve/reject requests (ACID transactions), mark returns, and log MongoDB maintenance.</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "0.8rem 1rem", borderRadius: 10 }}>
                <strong style={{ color: "#fcd34d" }}>3. Admin Role (Super Admin)</strong>
                <div style={{ color: "#e0e7ff" }}>Full system access including the Administrative Utilization &amp; Analytics Dashboard.</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#c7d2fe", marginBottom: "0.6rem", fontWeight: 700 }}>
              1-Click Demo Role Switcher (Seeded MySQL Users)
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => quickLogin("aditi@pes.edu", "aditi123")}
                className="btn"
                style={{ background: "#e0e7ff", color: "#1e1b4b", fontSize: "0.8rem", padding: "0.5rem 0.85rem" }}
              >
                Login as Student (Aditi)
              </button>
              <button
                type="button"
                onClick={() => quickLogin("rohan@pes.edu", "rohan123")}
                className="btn"
                style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.8rem", padding: "0.5rem 0.85rem" }}
              >
                Login as Club Manager (Rohan)
              </button>
              <button
                type="button"
                onClick={() => quickLogin("vikram@pes.edu", "vikram123")}
                className="btn"
                style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.8rem", padding: "0.5rem 0.85rem" }}
              >
                Login as Admin (Vikram)
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="btn"
              style={{
                flex: 1,
                background: mode === "login" ? "#fff" : "transparent",
                color: mode === "login" ? "#0f172a" : "#64748b",
                boxShadow: mode === "login" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className="btn"
              style={{
                flex: 1,
                background: mode === "register" ? "#fff" : "transparent",
                color: mode === "register" ? "#0f172a" : "#64748b",
                boxShadow: mode === "register" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Create Account (scrypt Hash)
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.95rem" }}>
            {mode === "register" && (
              <>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Full Name</label>
                  <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Hemaksh Breja" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Account Role (ISA Subtype)</label>
                    <select className="select" value={roleType} onChange={(e) => setRoleType(e.target.value as any)}>
                      <option value="student">Student</option>
                      <option value="club_officer">Club Manager / Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Primary Club</label>
                    <select className="select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                      <option value="1">Photography Club</option>
                      <option value="2">Robotics Club</option>
                      <option value="3">Drama Society</option>
                      <option value="4">Music Club</option>
                    </select>
                  </div>
                </div>
                {roleType === "student" && (
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Student SRN / Roll No</label>
                    <input className="input" required value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="e.g., PES2UG24CS999" />
                  </div>
                )}
                {roleType === "club_officer" && (
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Club Manager Title</label>
                    <input className="input" required value={clubRole} onChange={(e) => setClubRole(e.target.value)} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Phone</label>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Email Address</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aditi@pes.edu" />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Password</label>
              <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ padding: "0.7rem", borderRadius: 8, background: "#fee2e2", color: "#991b1b", fontSize: "0.85rem", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginTop: "0.25rem", padding: "0.75rem" }}>
              {submitting ? "Authenticating..." : mode === "login" ? "Sign In to Dashboard" : "Register & Hash Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
