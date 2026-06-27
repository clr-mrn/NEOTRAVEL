import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      return NextResponse.json(
        { reply: "Configuration manquante : la variable N8N_WEBHOOK_URL n'est pas définie." },
        { status: 500 }
      );
    }

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message ?? "",
        sessionId: body.sessionId ?? "anonymous",
      }),
    });

    const text = await r.text();

    // n8n peut renvoyer du JSON {reply/output} ou du texte brut : on gère les deux.
    let reply = text;
    try {
      const j = JSON.parse(text);
      reply = j.reply ?? j.output ?? j.text ?? text;
    } catch {
      /* réponse en texte brut : on garde `text` */
    }

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { reply: "Désolé, une erreur est survenue. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
