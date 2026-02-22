"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ProjectsPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = "/login";
        return;
      }
      supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>Projekty</h1>
            <div style={{ color: "#666", fontSize: 13 }}>{email}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/new-project" style={{ padding: "10px 12px", borderRadius: 12, background: "#111", color: "white", textDecoration: "none", fontWeight: 700 }}>
              Nowy projekt
            </a>
            <button onClick={signOut} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}>
              Wyloguj
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, color: "#666" }}>
          Na razie tu będzie lista zapisanych projektów (następny krok).
        </div>
      </div>
    </div>
  );
}
