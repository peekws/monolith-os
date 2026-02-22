"use client";

import { useState } from "react";

export default function AdminCreateUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // opcjonalnie
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOut(null);

    const payload: any = { username };
    if (password.trim().length > 0) payload.password = password.trim();

    const r = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!data.ok) setErr(data.error ?? "error");
    else setOut(data);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="card">
        <h1>Admin</h1>
        <p style={{ color: "#9aa0ad", marginTop: -8 }}>
          Tworzysz konto: username + hasło (możesz wpisać własne lub zostawić puste → wygeneruje).
        </p>

        <form onSubmit={createUser} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#9aa0ad", marginBottom: 6 }}>Username</div>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="np. klient_01" />
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#9aa0ad", marginBottom: 6 }}>Hasło (opcjonalnie)</div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 8 znaków lub zostaw puste" />
          </div>

          <button type="submit">Utwórz konto</button>
        </form>

        {err && (
          <div style={{ marginTop: 12, color: "#ef4444", fontSize: 13 }}>
            Błąd: {err}
          </div>
        )}

        {out && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#9aa0ad", marginBottom: 6 }}>Dane do logowania</div>
            <pre style={{ background: "#0f1115", border: "1px solid #262b36", padding: 12, borderRadius: 12, overflow: "auto" }}>
{JSON.stringify(out, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
