// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const NAVY = "#1C3354";
const TEAL = "#1AA89A";
const BG = "#EAF1F8";

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Bonjour ! Je suis l'assistant NeoTravel. Quel déplacement de groupe souhaitez-vous organiser ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // identifiant de session (un par visiteur) pour la mémoire de l'agent
  const sessionId = useRef<string>("");
  useEffect(() => {
    sessionId.current =
      (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
        : "sess-" + Math.random().toString(36).slice(2);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply ?? "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Erreur de connexion. Réessayez." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "system-ui, Arial, sans-serif" }}>
      {/* En-tête */}
      <div style={{ width: "100%", maxWidth: 720, padding: "28px 20px 8px" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: NAVY }}>
          Neo<span style={{ color: TEAL }}>Travel</span>
        </div>
        <p style={{ color: "#6E7A8A", marginTop: 6 }}>
          Organisez votre transport de groupe, simplement. Décrivez votre besoin, notre assistant s'occupe du reste.
        </p>
      </div>

      {/* Carte de chat */}
      <div style={{ width: "100%", maxWidth: 720, flex: 1, padding: "8px 20px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 14px 40px rgba(20,45,80,.12)", display: "flex", flexDirection: "column", overflow: "hidden", flex: 1, minHeight: 460 }}>
          {/* barre titre */}
          <div style={{ background: NAVY, color: "#fff", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: TEAL, display: "inline-block" }} />
            <div>
              <div style={{ fontWeight: 600 }}>Assistant NeoTravel</div>
              <div style={{ fontSize: 12, color: "#BFD0DE" }}>en ligne</div>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "78%", background: m.role === "user" ? NAVY : "#F0F4F9", color: m.role === "user" ? "#fff" : "#222B38", padding: "10px 14px", borderRadius: 16, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "#F0F4F9", color: "#6E7A8A", padding: "10px 14px", borderRadius: 16, fontStyle: "italic" }}>
                L'assistant écrit…
              </div>
            )}
          </div>

          {/* saisie */}
          <div style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid #E8EDF3" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Écrivez votre message…"
              style={{ flex: 1, border: "1px solid #DCE3EC", borderRadius: 24, padding: "12px 18px", fontSize: 15, outline: "none" }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{ background: TEAL, color: "#fff", border: "none", borderRadius: "50%", width: 46, height: 46, cursor: loading ? "default" : "pointer", fontSize: 18, opacity: loading ? 0.6 : 1 }}
              aria-label="Envoyer"
            >
              ➤
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#9AA4B0", fontSize: 12, marginTop: 14 }}>
          Réponse en quelques minutes · Devis clair et détaillé · Conseil humain à tout moment
        </p>
      </div>
    </main>
  );
}
