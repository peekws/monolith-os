import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = body?.username;
  const passwordInput = body?.password;

  if (!username || typeof username !== "string") {
    return NextResponse.json({ ok: false, error: "username required" }, { status: 400 });
  }
  if (!/^[a-z0-9_]{3,20}$/i.test(username)) {
    return NextResponse.json({ ok: false, error: "username must be 3-20 chars: letters, numbers, _" }, { status: 400 });
  }

  let password: string;
  if (passwordInput && typeof passwordInput === "string") {
    if (passwordInput.length < 8) {
      return NextResponse.json({ ok: false, error: "password must be at least 8 characters" }, { status: 400 });
    }
    password = passwordInput;
  } else {
    password = crypto.randomBytes(9).toString("base64url"); // ~12 znaków
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl) return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
  if (!serviceKey) return NextResponse.json({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const email = `${username}@monolithos.local`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });

  const userId = created.user?.id;
  if (!userId) return NextResponse.json({ ok: false, error: "No user id returned" }, { status: 500 });

  const { error: profErr } = await admin.from("profiles").insert({ user_id: userId, username });
  if (profErr) {
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ ok: false, error: `Profile insert failed: ${profErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, username, password });
}
