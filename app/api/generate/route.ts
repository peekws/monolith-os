import { NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Missing ANTHROPIC_API_KEY in .env.local" }, { status: 500 });
    }

    const budget = Number(body.budget_daily ?? 0);
    const budgetTier = budget <= 50 ? "small" : budget <= 150 ? "medium" : "large";

    const prompt = `
You are a senior Google Ads Search strategist (Poland).

Build ONE Search campaign for ONE service.
- Choose number of ad groups based on budget tier:
  - small: 2-3
  - medium: 3-5
  - large: 5-7
- Each ad group is a distinct intent bucket.
- Provide high-intent keywords only (buy/price/quote/contact). No informational queries.
- Provide match types: exact and phrase.
- Provide per-group negatives and campaign negatives.
- Provide RSA in Polish: 12-15 headlines, 4 descriptions.
- Each ad group must have a different landing_url (propose best-fit paths on the site).

Return ONLY valid JSON. No markdown. Double quotes. No trailing commas.

INPUT:
${JSON.stringify(
  {
    site_url: body.site_url,
    service: body.service,
    location: body.location,
    target: body.target,
    goal: body.goal,
    budget_daily: budget,
    budget_tier: budgetTier,
    language: "pl",
  },
  null,
  2
)}

JSON schema:
{
  "campaign": { "name": "string", "goal": "leads|calls|sales", "location": "string", "budget_daily": 0 },
  "campaign_negatives": ["string"],
  "ad_groups": [
    {
      "name": "string",
      "intent": "string",
      "landing_url": "string",
      "keywords": { "exact": ["string"], "phrase": ["string"] },
      "negatives": ["string"],
      "rsa": { "headlines": ["string"], "descriptions": ["string"] }
    }
  ],
  "qa_checks": ["string"],
  "notes": ["string"]
}
`.trim();

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3500,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ ok: false, error: `Anthropic API error ${resp.status}`, details: t }, { status: 500 });
    }

    const data = await resp.json();
    const text = data?.content?.[0]?.text ?? "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json({ ok: false, error: "No JSON found in model response", raw: text }, { status: 500 });
    }

    const rawJson = text.slice(start, end + 1);
    const fixed = jsonrepair(rawJson);
    const out = JSON.parse(fixed);

    return NextResponse.json({ ok: true, output: out });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
