"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Step =
  | "trajet_depart"
  | "trajet_arrivee"
  | "dates"
  | "passagers"
  | "options"
  | "result";

interface DevisData {
  depart: string;
  arrivee: string;
  dates: string;
  passagers: number;
  nuitChauffeur: boolean;
}

interface Message {
  role: "assistant" | "user";
  content: string | React.ReactNode;
}

function DevisCard({ data }: { data: DevisData }) {
  const distanceKm = 140;
  const basePrice = distanceKm * 5.3;
  const allerRetour = basePrice;
  const saisonCoeff = basePrice * 0.1;
  const capaciteCoeff = data.passagers >= 54 ? (basePrice + allerRetour + saisonCoeff) * 0.15 : 0;
  const nuit = data.nuitChauffeur ? 120 : 0;
  const marge = (basePrice + allerRetour + saisonCoeff + capaciteCoeff + nuit) * 0.15;
  const totalHT = basePrice + allerRetour + saisonCoeff + capaciteCoeff + nuit + marge;
  const tva = totalHT * 0.1;
  const totalTTC = totalHT + tva;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const lines = [
    { label: `Base distance (${distanceKm} km)`, amount: basePrice },
    { label: "Aller/retour (×2)", amount: allerRetour },
    { label: "Coefficient saison — Haute (+10 %)", amount: saisonCoeff },
    ...(capaciteCoeff > 0
      ? [{ label: `Coefficient capacité — ${data.passagers} pax (+15 %)`, amount: capaciteCoeff }]
      : []),
    ...(nuit > 0 ? [{ label: "Option nuit chauffeur", amount: nuit }] : []),
    { label: "Marge commerciale (+15 %)", amount: marge },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{ background: "#fff", border: "1px solid #e8edf2" }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "2px solid #1AA89A" }}
      >
        <span className="font-bold text-sm" style={{ color: "#1C3354" }}>
          Devis — {data.depart} → {data.arrivee}
        </span>
        <span className="text-sm" style={{ color: "#8fa3b8" }}>
          {data.dates}
        </span>
      </div>

      {/* Lines */}
      <div className="px-5 py-3 divide-y divide-gray-100">
        {lines.map((line) => (
          <div key={line.label} className="flex justify-between py-3 text-sm">
            <span style={{ color: "#3d5370" }}>{line.label}</span>
            <span className="font-medium" style={{ color: "#1C3354" }}>
              {fmt(line.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Totaux */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid #e8edf2", background: "#f8fafc" }}
      >
        <div className="flex justify-between text-sm mb-1" style={{ color: "#8fa3b8" }}>
          <span>Total HT</span>
          <span>{fmt(totalHT)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3" style={{ color: "#8fa3b8" }}>
          <span>TVA 10 %</span>
          <span>{fmt(tva)}</span>
        </div>
        <div className="flex justify-between font-bold text-base" style={{ color: "#1C3354" }}>
          <span>Total TTC</span>
          <span style={{ color: "#1AA89A" }}>{fmt(totalTTC)}</span>
        </div>
      </div>
    </div>
  );
}

const QUESTIONS: Record<Step, string> = {
  trajet_depart: "Bonjour ! Je suis l'assistant NeoTravel 👋\n\nQuelle est votre ville de départ ?",
  trajet_arrivee: "Parfait ! Et quelle est votre ville d'arrivée ?",
  dates: "Quelles sont les dates de votre trajet ? (ex: 14/07 au 16/07/2026)",
  passagers: "Combien de passagers serez-vous ?",
  options: "Avez-vous besoin de l'option nuit chauffeur ? (oui / non)",
  result: "",
};

export default function DevisPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: QUESTIONS.trajet_depart },
  ]);
  const [step, setStep] = useState<Step>("trajet_depart");
  const [input, setInput] = useState("");
  const [data, setData] = useState<Partial<DevisData>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const val = input.trim();
    if (!val) return;
    setInput("");

    const userMsg: Message = { role: "user", content: val };
    let nextStep: Step = step;
    let nextData = { ...data };

    if (step === "trajet_depart") {
      nextData.depart = val;
      nextStep = "trajet_arrivee";
    } else if (step === "trajet_arrivee") {
      nextData.arrivee = val;
      nextStep = "dates";
    } else if (step === "dates") {
      nextData.dates = val;
      nextStep = "passagers";
    } else if (step === "passagers") {
      nextData.passagers = parseInt(val) || 1;
      nextStep = "options";
    } else if (step === "options") {
      nextData.nuitChauffeur = val.toLowerCase().startsWith("o");
      nextStep = "result";
    }

    setData(nextData);
    setStep(nextStep);

    const assistantContent: Message["content"] =
      nextStep === "result" ? (
        <div className="flex flex-col gap-4">
          <p>Voici votre devis, détaillé ligne par ligne :</p>
          <DevisCard data={nextData as DevisData} />
          <p className="text-xs" style={{ color: "#8fa3b8" }}>
            Prix calculé automatiquement par le moteur — détail auditable, jamais par l&apos;IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1AA89A, #0d8f83)" }}
            >
              Recevoir le devis PDF
            </button>
            <button
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-gray-50"
              style={{
                border: "1.5px solid #1C3354",
                color: "#1C3354",
                background: "white",
              }}
            >
              Parler à un conseiller
            </button>
          </div>
        </div>
      ) : (
        QUESTIONS[nextStep]
      );

    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: assistantContent },
    ]);
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
      <div className="relative z-10 w-full max-w-xl flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#f0f4f8", minHeight: "600px", maxHeight: "85vh" }}
      >
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
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
              <span className="text-xs" style={{ color: "#1AA89A" }}>en ligne</span>
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
                className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
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
                        whiteSpace: typeof msg.content === "string" ? "pre-line" : undefined,
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {step !== "result" && (
          <div
            className="px-4 py-4"
            style={{ background: "white", borderTop: "1px solid #e8edf2" }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                style={{
                  background: "#f0f4f8",
                  color: "#1C3354",
                  border: "none",
                }}
              />
              <button
                onClick={send}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1AA89A, #0d8f83)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
