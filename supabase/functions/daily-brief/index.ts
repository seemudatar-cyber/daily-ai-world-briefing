// supabase/functions/daily-brief/index.ts
// Edge Function that generates a combined AI + World news briefing
// and emails it using Resend.

Deno.serve(async (_req) => {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const toEmail = Deno.env.get("DAILY_BRIEF_TO");

  if (!openaiKey || !resendKey || !toEmail) {
    console.error("Missing one or more environment variables.");
    return new Response("Server not configured", { status: 500 });
  }

  const prompt = `
Create a single combined daily briefing that includes:

SECTION 1 — AI UPDATES
- Top 3 AI developments or tools from the last 24 hours.
- Focus on items relevant to a senior payments/fintech technology leader.
- Explain in simple language that a smart 15–16-year-old would understand.
- Keep this section under 130 words.

SECTION 2 — WORLD + US NEWS
- Most important US + global news from the last 24 hours (politics, economy, major conflicts, climate/disasters, major tech or societal shifts).
- Also explain in simple, clear language.
- Keep this section under 140 words.

FORMAT:
- Use clear section headers.
- Use short bullet points.
- Total under 270 words.
  `.trim();

  // 1) Call OpenAI for the combined brief
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, clear daily briefings for a senior payments/fintech technology leader.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!openaiRes.ok) {
    const errorText = await openaiRes.text();
    console.error("OpenAI error:", errorText);
    return new Response("OpenAI error", { status: 500 });
  }

  const openaiJson = await openaiRes.json();
  const content: string =
    openaiJson.choices?.[0]?.message?.content ?? "No content from OpenAI.";

  // 2) Send the email via Resend
  const emailPayload = {
    from: "Daily Brief <onboarding@resend.dev>", // or a verified domain later
    to: [toEmail],
    subject: "Your Daily AI + World Brief",
    text: content,
  };

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!resendRes.ok) {
    const errorText = await resendRes.text();
    console.error("Resend error:", errorText);
    return new Response("Email error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
