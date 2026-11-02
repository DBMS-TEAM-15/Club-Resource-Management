"use client";

import { useEffect, useState } from "react";
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
  const [clubRole, setClubRole] = useState("");
  const [adminLevel, setAdminLevel] = useState("System Admin");
  const [clubId, setClubId] = useState("1");
  const [clubs, setClubs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [registeredInfo, setRegisteredInfo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => {
        if (data.clubs && data.clubs.length > 0) {
          setClubs(data.clubs);
          setClubId(String(data.clubs[0].club_id));
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRegisteredInfo(null);
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
          adminLevel,
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

      if (mode === "register") {
        setRegisteredInfo(data);
        setSubmitting(false);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRollNo("");
        setClubRole("");
        return;
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 540, width: "100%" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%)",
            color: "#fff",
            padding: "1.75rem 2rem",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 16px 35px -10px rgba(49, 46, 129, 0.35)",
          }}
        >
          <span className="badge badge-indigo" style={{ marginBottom: "0.75rem" }}>
            MySQL ISA Roles + MongoDB Credential Store
          </span>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.4rem" }}>
            Campus Club Resource Exchange
          </h1>
          <p style={{ color: "#c7d2fe", fontSize: "0.88rem", margin: 0 }}>
            Sign in with your account or register a new user to store <code>scrypt</code> hashed credentials in MySQL &amp; MongoDB (<code>user_credentials</code>).
          </p>
        </div>

        <div
          className="card"
          style={{
            padding: "2rem",
            borderRadius: "0 0 16px 16px",
            borderTop: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              background: "#f1f5f9",
              padding: 4,
              borderRadius: 10,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setRegisteredInfo(null);
              }}
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
              onClick={() => {
                setMode("register");
                setError("");
                setRegisteredInfo(null);
              }}
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

          {registeredInfo && (
            <div
              style={{
                padding: "1rem",
                borderRadius: 10,
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                marginBottom: "1.25rem",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "0.35rem", fontSize: "0.92rem" }}>
                Account Registered in MySQL &amp; MongoDB (`user_credentials`)!
              </div>
              <div>
                <strong>User:</strong> {registeredInfo.user.name} ({registeredInfo.user.email}) —{" "}
                <strong>Role:</strong> <code>{registeredInfo.user.role}</code> (ID #{registeredInfo.user.user_id})
              </div>
              <div
                style={{
                  marginTop: "0.4rem",
                  padding: "0.45rem 0.6rem",
                  background: "#d1fae5",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  wordBreak: "break-all",
                }}
              >
                {registeredInfo.password_hash}
              </div>
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 0.95rem", fontSize: "0.82rem" }}
                >
                  Continue to Dashboard as {registeredInfo.user.name} &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setRegisteredInfo(null)}
                  className="btn btn-outline"
                  style={{ padding: "0.5rem 0.95rem", fontSize: "0.82rem", background: "#fff" }}
                >
                  Register Another User
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.95rem" }}>
            {mode === "register" && (
              <>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Full Name</label>
                  <input
                    className="input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Account Role (ISA Subtype)</label>
                    <select
                      className="select"
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value as any)}
                    >
                      <option value="student">Student</option>
                      <option value="club_officer">Club Manager / Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Primary Club</label>
                    <select
                      className="select"
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                    >
                      {clubs.map((c) => (
                        <option key={c.club_id} value={c.club_id}>
                          {c.club_name} ({c.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {roleType === "student" && (
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Student SRN / Roll No</label>
                    <input
                      className="input"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="Enter SRN / Roll Number"
                    />
                  </div>
                )}
                {roleType === "club_officer" && (
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Club Manager Title</label>
                    <input
                      className="input"
                      required
                      value={clubRole}
                      onChange={(e) => setClubRole(e.target.value)}
                      placeholder="e.g., Club Coordinator / President"
                    />
                  </div>
                )}
                {roleType === "admin" && (
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Admin Level</label>
                    <input
                      className="input"
                      required
                      value={adminLevel}
                      onChange={(e) => setAdminLevel(e.target.value)}
                      placeholder="e.g., Super Admin / System Admin"
                    />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Phone</label>
                  <input
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Email Address</label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@pes.edu"
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Password</label>
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.7rem",
                  borderRadius: 8,
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ marginTop: "0.25rem", padding: "0.75rem" }}
            >
              {submitting
                ? "Processing..."
                : mode === "login"
                ? "Sign In to Dashboard"
                : "Register & Hash Password (Saves to MySQL + MongoDB)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
