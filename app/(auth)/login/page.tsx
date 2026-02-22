"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const r = await fetch("/api/auth/lookup-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await r.json();
    if (!data.ok) {
      setErr(data.error);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password,
    });

    if (error) setErr(error.message);
    else window.location.href = "/projects";
  }

  return (
    <div style={{ maxWidth: 400, margin: "120px auto" }}>
      <div className="card">
        <h1>Logowanie</h1>

        <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Zaloguj</button>
        </form>

        {err && (
          <div style={{ marginTop: 12, color: "#ef4444", fontSize: 13 }}>
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
