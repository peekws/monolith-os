"use client";

import { useState } from "react";

function CopyButton({ label, text }: { label: string; text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

export default function NewProjectPage() {
  const [siteUrl, setSiteUrl] = useState("https://revize.pl");
  const [service, setService] = useState("Google Ads");
  const [location, setLocation] = useState("Polska");
  const [target, setTarget] = useState("B2B");
  const [goal, setGoal] = useState("leads");
  const [budgetDaily, setBudgetDaily] = useState("80");

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [tab, setTab] = useState<"preview" | "json">("preview");

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);

    const r = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_url: siteUrl,
        service,
        location,
        target,
        goal,
        budget_daily: Number(String(budgetDaily).replace(",", ".")),
      }),
    });

    const data = await r.json();
    setOutput(data?.output ?? data);
    setTab("preview");
    setLoading(false);
  }

  const campaign = output?.campaign;
  const adGroups = output?.ad_groups ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9", color: "#111", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>Monolith OS</div>
            <div style={{ color: "#555", marginTop: 4 }}>1 kampania = 1 usługa • Search generator</div>
          </div>
          <div
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: "#fff",
              border: "1px solid #e5e7eb",
              fontSize: 12,
              color: "#555",
            }}
          >
            {loading ? "Generowanie..." : "Gotowe"}
          </div>
        </div>

        <div style={{ marginTop: 18, display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <Card title="Nowy projekt">
            <form onSubmit={onGenerate} style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                Site URL
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://twoja-strona.pl"
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 14,
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                Usługa
                <input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="np. Strony internetowe"
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 14,
                  }}
                />
              </label>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                  Lokalizacja
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="np. Warszawa / Polska"
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      fontSize: 14,
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                  Budżet dzienny
                  <input
                    value={budgetDaily}
                    onChange={(e) => setBudgetDaily(e.target.value)}
                    placeholder="np. 80"
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      fontSize: 14,
                    }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                  Target
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      fontSize: 14,
                    }}
                  >
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
                  Cel
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      fontSize: 14,
                    }}
                  >
                    <option value="leads">leads</option>
                    <option value="calls">calls</option>
                    <option value="sales">sales</option>
                  </select>
                </label>
              </div>

              <button
                disabled={loading}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: loading ? "#e5e7eb" : "#111",
                  color: loading ? "#666" : "#fff",
                  fontWeight: 700,
                  border: "1px solid #111",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Generuję..." : "Generate"}
              </button>

              <div style={{ fontSize: 12, color: "#666", background: "#f3f4f6", padding: 10, borderRadius: 12 }}>
                Mały budżet = 2–3 grupy • Średni = 3–5 • Duży = 5–7
              </div>
            </form>
          </Card>

          <Card title="Wynik">
            {!output ? (
              <div style={{ color: "#666", fontSize: 14 }}>Wygeneruj kampanię, żeby zobaczyć wynik.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => setTab("preview")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: tab === "preview" ? "#111" : "#fff",
                      color: tab === "preview" ? "#fff" : "#111",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Podgląd
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("json")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: tab === "json" ? "#111" : "#fff",
                      color: tab === "json" ? "#fff" : "#111",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    JSON
                  </button>
                </div>

                {tab === "json" ? (
                  <pre
                    style={{
                      background: "#0b0f19",
                      color: "#e5e7eb",
                      padding: 12,
                      borderRadius: 12,
                      overflow: "auto",
                      maxHeight: 520,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {JSON.stringify(output, null, 2)}
                  </pre>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{campaign?.name ?? "Campaign"}</div>
                      <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                        Cel: {campaign?.goal} • Lokalizacja: {campaign?.location} • Budżet: {campaign?.budget_daily} zł/d
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 12 }}>
                      {adGroups.map((g: any, idx: number) => {
                        const exact = (g?.keywords?.exact ?? []).join("\n");
                        const phrase = (g?.keywords?.phrase ?? []).join("\n");
                        const neg = (g?.negatives ?? []).join("\n");
                        const h = (g?.rsa?.headlines ?? []).join("\n");
                        const d = (g?.rsa?.descriptions ?? []).join("\n");

                        return (
                          <div
                            key={idx}
                            style={{
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: 14,
                              padding: 12,
                            }}
                          >
                            <div style={{ fontWeight: 800 }}>{g?.name ?? `Ad group ${idx + 1}`}</div>
                            <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                              Intencja: {g?.intent} • Landing:{" "}
                              <a href={g?.landing_url} target="_blank" rel="noreferrer">
                                {g?.landing_url}
                              </a>
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                              <CopyButton label="Kopiuj EXACT" text={exact} />
                              <CopyButton label="Kopiuj PHRASE" text={phrase} />
                              <CopyButton label="Kopiuj negatywy" text={neg} />
                              <CopyButton label="Kopiuj nagłówki" text={h} />
                              <CopyButton label="Kopiuj opisy" text={d} />
                            </div>

                            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
                              <div>
                                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>EXACT</div>
                                <pre style={{ background: "#f3f4f6", padding: 10, borderRadius: 12, overflow: "auto" }}>
                                  {exact}
                                </pre>
                              </div>
                              <div>
                                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>PHRASE</div>
                                <pre style={{ background: "#f3f4f6", padding: 10, borderRadius: 12, overflow: "auto" }}>
                                  {phrase}
                                </pre>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>
          Tip: jeśli output jest za długi, zmniejszymy liczbę grup reklam lub max_tokens.
        </div>
      </div>
    </div>
  );
}
