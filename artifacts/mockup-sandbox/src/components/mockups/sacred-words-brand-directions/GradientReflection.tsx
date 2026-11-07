import "./_group.css";

export function GradientReflection() {
  return (
    <main className="sw-brand-direction" style={{ background: "#f1f0ed", padding: 10 }}>
      <section
        aria-label="Gradient Reflection app icon direction"
        style={{
          width: 260,
          height: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
          color: "#282d38",
          fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            flex: "0 0 auto",
            borderRadius: 42,
            overflow: "hidden",
            boxShadow: "0 18px 44px rgba(62, 64, 94, .17), 0 2px 6px rgba(62, 64, 94, .08)",
          }}
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" role="img" aria-label="Abstract layered gradient reflection mark">
            <defs>
              <linearGradient id="reflection-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#273b67" />
                <stop offset=".52" stopColor="#655b98" />
                <stop offset="1" stopColor="#bd7794" />
              </linearGradient>
              <linearGradient id="ribbon-a" x1=".08" y1=".1" x2=".92" y2=".94">
                <stop offset="0" stopColor="#f5c5ae" />
                <stop offset=".48" stopColor="#e997a1" />
                <stop offset="1" stopColor="#d57db1" />
              </linearGradient>
              <linearGradient id="ribbon-b" x1=".94" y1=".12" x2=".06" y2=".92">
                <stop offset="0" stopColor="#b5dfd2" />
                <stop offset=".52" stopColor="#85c8ce" />
                <stop offset="1" stopColor="#94a9dc" />
              </linearGradient>
              <linearGradient id="reflection-core" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset="1" stopColor="#f3d9bd" />
              </linearGradient>
              <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dy="5" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope=".18" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="240" height="240" rx="54" fill="url(#reflection-bg)" />
            <circle cx="120" cy="117" r="84" fill="#f1c4cb" opacity=".09" />
            <g transform="translate(120 120) scale(1.2) translate(-120 -120)" filter="url(#soft-shadow)">
              <path
                d="M120 43C92 61 69 87 69 117c0 31 23 56 51 81 28-25 51-50 51-81 0-30-23-56-51-74Z"
                fill="url(#ribbon-a)"
              />
              <path
                d="M120 43c28 18 51 44 51 74 0 31-23 56-51 81-28-25-51-50-51-81 0-30 23-56 51-74Z"
                fill="url(#ribbon-b)"
                opacity=".95"
              />
              <path
                d="M120 69c-18 14-33 31-33 51 0 22 15 39 33 57 18-18 33-35 33-57 0-20-15-37-33-51Z"
                fill="url(#reflection-bg)"
              />
              <path
                d="M120 91c-10 10-17 19-17 30 0 12 7 21 17 32 10-11 17-20 17-32 0-11-7-20-17-30Z"
                fill="url(#reflection-core)"
              />
            </g>
            <path d="M120 101v30" stroke="#fff8e9" strokeWidth="2" strokeLinecap="round" opacity=".8" />
            <circle cx="120" cy="136" r="2.5" fill="#fff8e9" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 650, letterSpacing: "-.035em" }}>Gradient Reflection</div>
          <p
            style={{
              maxWidth: 250,
              margin: "5px auto 0",
              color: "#70727d",
              fontSize: 11.5,
              lineHeight: 1.35,
              letterSpacing: ".005em",
            }}
          >
            Layered color gathers around a still point—a quiet mark for the daily moment of prayer.
          </p>
        </div>
      </section>
    </main>
  );
}
