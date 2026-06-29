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

    const userMsg: Message = { role: "user", content: val };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: val, sessionId }),
      });

      const data = await res.json();
      const reply = data.reply ?? "Désolé, je n'ai pas pu obtenir de réponse.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Une erreur est survenue. Veuillez réessayer.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(160deg, #0b1929 0%, #1C3354 45%, #0f2540 100%)",
      }}
    >
      {/* Accent line */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ background: "linear-gradient(90deg, #1AA89A, #14c4b5, #1AA89A)" }}
      />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #1AA89A, transparent 70%)" }}
        />
      </div>

      {/* Chat window */}
      <div
        className="relative z-10 w-full max-w-xl flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#f0f4f8", minHeight: "600px", maxHeight: "85vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ background: "#1C3354" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1AA89A, #0d8f83)" }}
          >
            NT
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Assistant NeoTravel</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#1AA89A" }}
              />
              <span className="text-xs" style={{ color: "#1AA89A" }}>
                en ligne
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="ml-auto text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
            title="Retour à l'accueil"
          >
            ←
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, #1AA89A, #0d8f83)",
                        color: "white",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "white",
                        color: "#1C3354",
                        borderBottomLeftRadius: "4px",
                        boxShadow: "0 1px 4px rgba(28,51,84,0.08)",
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl flex gap-1 items-center"
                style={{
                  background: "white",
                  borderBottomLeftRadius: "4px",
                  boxShadow: "0 1px 4px rgba(28,51,84,0.08)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: "#1AA89A",
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
          style={{ background: "white", borderTop: "1px solid #e8edf2" }}
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
              className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
              style={{
                background: "#f0f4f8",
                color: "#1C3354",
                border: "none",
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1AA89A, #0d8f83)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </main>
  );
}
