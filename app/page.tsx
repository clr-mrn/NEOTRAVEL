import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background — dark navy comme le header du devis */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0b1929 0%, #1C3354 45%, #0f2540 100%)",
        }}
      />

      {/* Ambient teal glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, #1AA89A 0%, #0d7a71 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute top-1/4 right-1/3 w-[250px] h-[250px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #1AA89A, transparent)" }}
        />
      </div>

      {/* Ligne d'accent teal — même que dans le devis */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, #1AA89A, #14c4b5, #1AA89A)" }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center px-8 py-6 md:px-16">
        <span className="text-white font-bold text-xl tracking-wide">
          <span style={{ color: "#ffffff" }}>Neo</span>
          <span style={{ color: "#1AA89A" }}>Travel</span>
        </span>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(26,168,154,0.12)",
            border: "1px solid rgba(26,168,154,0.35)",
            color: "#1AA89A",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#1AA89A" }}
          />
          Transport de groupe simplifié
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-none"
          style={{ textShadow: "0 0 80px rgba(26,168,154,0.2)" }}
        >
          Neo
          <span
            style={{
              background: "linear-gradient(90deg, #1AA89A, #14c4b5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Travel
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-lg md:text-xl max-w-md mb-12 leading-relaxed">
          Organisez vos voyages de groupe en quelques clics. Rapide, simple, intelligent.
        </p>

        {/* CTA */}
        <Link
          href="/devis"
          className="group relative px-8 py-4 rounded-full text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #1AA89A, #0d8f83)",
            boxShadow: "0 0 40px rgba(26,168,154,0.35)",
          }}
        >
          <span className="relative z-10">Je génère mon devis</span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #14c4b5, #1AA89A)" }}
          />
        </Link>

        {/* Stats */}
        <div className="mt-20 flex flex-col sm:flex-row items-center gap-8 sm:gap-16">
          {[
            { value: "10K+", label: "Voyageurs" },
            { value: "98%", label: "Satisfaction" },
            { value: "500+", label: "Destinations" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm mt-1" style={{ color: "#1AA89A" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(26,168,154,0.3), transparent)",
        }}
      />
    </main>
  );
}
