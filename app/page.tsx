import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background sunset / road trip ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(175deg, #1a0a00 0%, #3d1a00 20%, #7a3200 40%, #c45a0a 62%, #e8923a 78%, #f5c84a 100%)",
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Road perspective lines */}
      <svg
        className="absolute bottom-0 left-0 right-0 opacity-15"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "40%" }}
      >
        <polygon points="720,0 0,400 1440,400" fill="#1a0a00" />
        <line x1="720" y1="0" x2="680" y2="400" stroke="#f5c84a" strokeWidth="4" strokeDasharray="30 20" />
        <line x1="720" y1="0" x2="760" y2="400" stroke="#f5c84a" strokeWidth="4" strokeDasharray="30 20" />
      </svg>

      {/* Sun glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(245,200,74,0.5) 0%, rgba(232,146,58,0.3) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0 h-px opacity-40"
        style={{ bottom: "38%", background: "linear-gradient(90deg, transparent, #f5c84a, transparent)" }}
      />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <span
          className="font-black text-2xl tracking-wide"
          style={{ color: "#f5e6c8", letterSpacing: "0.05em" }}
        >
          Neo<span style={{ color: "#f5c84a" }}>Travel</span>
        </span>

        {/* Vintage badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(245,200,74,0.15)",
            border: "1px solid rgba(245,200,74,0.4)",
            color: "#f5c84a",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Est. 2024
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-32">

        {/* Eyebrow tag */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(245,200,74,0.12)",
            border: "1px solid rgba(245,200,74,0.35)",
            color: "#f5c84a",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Transport de groupe · Partout en France
        </div>

        {/* Main title */}
        <h1
          className="font-black leading-none mb-4"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 8rem)",
            color: "#f5e6c8",
            textShadow: "0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(245,200,74,0.2)",
            letterSpacing: "-0.02em",
          }}
        >
          NEO
          <span
            style={{
              background: "linear-gradient(135deg, #f5c84a 0%, #e8923a 60%, #c45a0a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TRAVEL
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-lg md:text-xl max-w-lg mb-3 leading-relaxed font-medium"
          style={{ color: "rgba(245,230,200,0.75)" }}
        >
          Votre transport de groupe, organisé en quelques minutes.
        </p>
        <p
          className="text-sm mb-12 italic"
          style={{ color: "rgba(245,200,74,0.6)" }}
        >
          Devis instantané · Prix transparents · Zéro stress
        </p>

        {/* CTA */}
        <Link
          href="/devis"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base overflow-hidden transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #e8923a, #c45a0a)",
            color: "#f5e6c8",
            boxShadow: "0 0 50px rgba(232,146,58,0.5), 0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-amber-200 animate-pulse flex-shrink-0"
          />
          Je génère mon devis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #f5a050, #e8923a)" }}
          />
        </Link>

        {/* Stats */}
        <div className="mt-20 flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
          {[
            { value: "10K+", label: "Voyageurs transportés" },
            { value: "98%", label: "Clients satisfaits" },
            { value: "500+", label: "Destinations couvertes" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-black"
                style={{ color: "#f5c84a" }}
              >
                {value}
              </div>
              <div
                className="text-xs mt-1 uppercase tracking-widest"
                style={{ color: "rgba(245,230,200,0.5)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(26,10,0,0.6), transparent)" }}
      />
    </main>
  );
}
