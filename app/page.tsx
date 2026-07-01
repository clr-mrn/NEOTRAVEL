import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Landscape background ── */}
      <div className="absolute inset-0">
        {/* Sky */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #1a6fa8 0%, #2d9fd4 25%, #4ab8e0 40%, #6ecfed 50%, #3a8c3f 50%, #2d7a32 62%, #1e5c24 75%, #3d2e1a 88%, #2a1f0f 100%)",
          }}
        />

        {/* Mountain silhouettes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {/* Far mountains */}
          <polygon points="0,450 180,280 360,380 540,260 720,320 900,240 1080,310 1260,270 1440,350 1440,500 0,500" fill="#1a5a8a" opacity="0.6" />
          {/* Mid mountains */}
          <polygon points="0,500 200,360 350,420 500,340 650,400 800,330 950,390 1100,350 1280,410 1440,370 1440,560 0,560" fill="#1e6b2e" opacity="0.8" />
          {/* Forest line */}
          <polygon points="0,560 1440,560 1440,900 0,900" fill="#1e5c24" />
          {/* Trees silhouettes left */}
          {[60, 100, 130, 160, 200, 240].map((x, i) => (
            <ellipse key={i} cx={x} cy={560 - i * 8} rx={18 + i * 2} ry={60 + i * 5} fill="#154d1c" opacity="0.9" />
          ))}
          {/* Trees right */}
          {[1380, 1340, 1300, 1260, 1210, 1160].map((x, i) => (
            <ellipse key={i} cx={x} cy={560 - i * 6} rx={20 + i * 2} ry={65 + i * 5} fill="#154d1c" opacity="0.9" />
          ))}
          {/* Tall cypress-like trees left */}
          {[80, 120, 160, 200].map((x, i) => (
            <ellipse key={i} cx={x} cy={520} rx={10} ry={80} fill="#0f3d15" opacity="0.95" />
          ))}
          {[1360, 1320, 1280, 1240].map((x, i) => (
            <ellipse key={i} cx={x} cy={520} rx={10} ry={80} fill="#0f3d15" opacity="0.95" />
          ))}

          {/* Road */}
          <polygon points="580,900 660,580 780,580 860,900" fill="#4a4035" />
          <polygon points="605,900 665,580 775,580 855,900" fill="#5a5045" />
          {/* Road center line */}
          <line x1="720" y1="580" x2="730" y2="900" stroke="#e8c840" strokeWidth="3" strokeDasharray="40,30" opacity="0.8" />

          {/* Water/lake shimmer */}
          <ellipse cx="720" cy="480" rx="300" ry="40" fill="#5ac8f0" opacity="0.3" />
          <ellipse cx="720" cy="490" rx="250" ry="25" fill="#7dd4f5" opacity="0.2" />

          {/* Sun/light source */}
          <circle cx="720" cy="200" r="60" fill="#fff8e0" opacity="0.15" />
          <circle cx="720" cy="200" r="30" fill="#fff8e0" opacity="0.2" />
        </svg>

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Left dark vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* ── Top accent bar ── */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#e8c840" }} />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 md:px-14">
        <span className="font-black text-xl text-white tracking-wide drop-shadow">
          Neo<span style={{ color: "#e8c840" }}>Travel</span>
        </span>
        <span
          className="text-xs italic font-medium text-white/70 tracking-wider hidden md:block"
          style={{ fontStyle: "italic" }}
        >
          Life is a trip
        </span>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-14 pb-20 max-w-2xl">

        {/* Script tagline */}
        <p
          className="text-lg md:text-xl font-medium mb-3 tracking-wide"
          style={{
            color: "#e8c840",
            fontStyle: "italic",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Life is a trip
        </p>

        {/* Main title */}
        <h1
          className="font-black leading-tight mb-3 text-white drop-shadow-lg"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            lineHeight: 1.05,
            textShadow: "0 3px 20px rgba(0,0,0,0.6)",
          }}
        >
          Organisez votre voyage de groupe
        </h1>

        {/* Subtitle yellow */}
        <p
          className="font-black text-xl md:text-2xl mb-8 uppercase tracking-wide"
          style={{
            color: "#e8c840",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Simplement &amp; Rapidement
        </p>

        {/* Bullet points — style book cover */}
        <ul className="flex flex-col gap-2 mb-10">
          {[
            "Devis instantané et détaillé",
            "Prix transparents, zéro surprise",
            "Assistant disponible 24h/24",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#e8c840" }}
              />
              <span
                className="text-sm md:text-base font-medium text-white"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/devis"
            className="group relative inline-flex items-center gap-2 px-7 py-4 rounded-xl font-black text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "#e8c840",
              color: "#1a1a1a",
              boxShadow: "0 4px 25px rgba(232,200,64,0.4)",
            }}
          >
            Je génère mon devis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </Link>

          {/* Bonus badge */}
          <div
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-xs leading-tight text-center flex-shrink-0 rotate-12"
            style={{
              background: "#e8c840",
              color: "#1a1a1a",
              boxShadow: "0 3px 15px rgba(232,200,64,0.5)",
            }}
          >
            <span className="text-lg leading-none">✓</span>
            <span className="text-[10px] uppercase tracking-tight">Gratuit</span>
          </div>
        </div>
      </div>

      {/* ── Stats bar at bottom ── */}
      <div
        className="relative z-10 flex justify-around items-center px-8 py-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(232,200,64,0.3)" }}
      >
        {[
          { value: "10K+", label: "Voyageurs" },
          { value: "98%", label: "Satisfaction" },
          { value: "500+", label: "Destinations" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-lg md:text-2xl font-black" style={{ color: "#e8c840" }}>{value}</div>
            <div className="text-xs uppercase tracking-widest text-white/60">{label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
