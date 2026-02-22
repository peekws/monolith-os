"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      window.location.href = "/projects";
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui" }}>
      Loguję...
    </div>
  );
}
