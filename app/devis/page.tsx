"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function DevisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis l'assistant NeoTravel 👋\n\nDites-moi tout sur votre projet de transport de groupe : ville de départ, destination, dates et nombre de passagers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const val = input.trim();
    if (!val || loading) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: val }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: val, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Désolé, je n'ai pas pu obtenir de réponse." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Une erreur est survenue. Veuillez réessayer." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background paysage (même ADN que la homepage) ── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #1a6fa8 0%, #2d9fd4 28%, #4ab8e0 42%, #3a8c3f 52%, #1e5c24 72%, #2a1f0f 100%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <polygon points="0,450 200,300 400,380 600,270 800,340 1000,260 1200,320 1440,280 1440,520 0,520" fill="#1a5a8a" opacity="0.5" />
          <polygon points="0,520 180,380 380,440 580,360 780,420 980,350 1180,400 1440,360 1440,600 0,600" fill="#1e6b2e" opacity="0.7" />
          <polygon points="0,600 1440,600 1440,900 0,900" fill="#1e5c24" />
          {[50,90,130,170,210].map((x, i) => (
            <ellipse key={i} cx={x} cy={590} rx={12} ry={70 + i * 6} fill="#0f3d15" opacity="0.9" />
          ))}
          {[1390,1350,1310,1270,1230].map((x, i) => (
            <ellipse key={i} cx={x} cy={590} rx={12} ry={70 + i * 6} fill="#0f3d15" opacity="0.9" />
          ))}
        </svg>
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />
      </div>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 z-50" style={{ background: "#e8c840" }} />

      {/* ── Layout ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">

        {/* Header brand */}
        <div className="w-full max-w-xl mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Retour
          </Link>
          <span className="font-black text-white text-lg">
            Neo<span style={{ color: "#e8c840" }}>Travel</span>
          </span>
          <span className="text-xs italic text-white/50">Life is a trip</span>
        </div>

        {/* Chat window */}
        <div
          className="w-full max-w-xl flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{ minHeight: "560px", maxHeight: "80vh", background: "#f5f0e8" }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1C3354, #1a4a6e)",
              borderBottom: "3px solid #e8c840",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: "#e8c840", color: "#1a1a1a" }}
            >
              NT
            </div>
            <div>
              <div className="text-white font-bold text-sm">Assistant NeoTravel</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-300">en ligne</span>
              </div>
            </div>
            <div
              className="ml-auto text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: "rgba(232,200,64,0.15)", color: "#e8c840", border: "1px solid rgba(232,200,64,0.3)" }}
            >
              Devis gratuit
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3"
            style={{ background: "#f5f0e8" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mr-2 flex-shrink-0 mt-1"
                    style={{ background: "#e8c840", color: "#1a1a1a" }}
                  >
                    NT
                  </div>
                )}
                <div
                  className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                  style={
                    msg.role === "user"
                      ? {
                          background: "#1C3354",
                          color: "white",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "white",
                          color: "#1C3354",
                          borderBottomLeftRadius: "4px",
                          boxShadow: "0 1px 4px rgba(28,51,84,0.1)",
                          borderLeft: "3px solid #e8c840",
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: "#e8c840", color: "#1a1a1a" }}
                >
                  NT
                </div>
                <div
                  className="px-4 py-3 rounded-2xl flex gap-1 items-center"
                  style={{
                    background: "white",
                    borderBottomLeftRadius: "4px",
                    borderLeft: "3px solid #e8c840",
                    boxShadow: "0 1px 4px rgba(28,51,84,0.1)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: "#1C3354",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-4 py-4 flex-shrink-0"
            style={{ background: "white", borderTop: "1px solid rgba(28,51,84,0.1)" }}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Écrivez votre message..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "#f5f0e8",
                  color: "#1C3354",
                  border: "1.5px solid rgba(28,51,84,0.12)",
                  opacity: loading ? 0.6 : 1,
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
                style={{ background: "#e8c840" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: "#9a8f7a" }}>
              Prix calculé automatiquement · Jamais par l&apos;IA
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </main>
  );
}
