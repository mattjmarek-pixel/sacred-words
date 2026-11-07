import "./_group.css";

export function GentleGuideMascot() {
  return (
    <main className="sw-brand-direction" style={{ background: "#f1eee6", padding: 10 }}>
      <section style={{ width: 260, color: "#263b36", fontFamily: "'DM Sans', sans-serif" }}>
        <div
          aria-label="Sacred Words app icon: a quiet center held by an open circular mark"
          role="img"
          style={{
            width: 240,
            height: 240,
            borderRadius: 44,
            overflow: "hidden",
            boxShadow: "0 15px 32px rgba(34, 54, 47, .18), 0 2px 6px rgba(34, 54, 47, .12)",
          }}
        >
          <svg viewBox="0 0 240 240" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="quiet-center-tile" x1="20" y1="10" x2="220" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#27483f" />
                <stop offset="1" stopColor="#172f2b" />
              </linearGradient>
              <linearGradient id="quiet-center-mark" x1="67" y1="47" x2="171" y2="193" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f5ebcf" />
                <stop offset="1" stopColor="#d6bf86" />
              </linearGradient>
              <filter id="quiet-center-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#081c19" floodOpacity=".32" />
              </filter>
            </defs>
            <rect width="240" height="240" rx="46" fill="url(#quiet-center-tile)" />
            <circle cx="120" cy="120" r="86" fill="none" stroke="#b9c8b7" strokeOpacity=".13" strokeWidth="1" />
            <g filter="url(#quiet-center-shadow)">
              <path
                d="M160.4 57.9A75 75 0 1 0 183 111"
                fill="none"
                stroke="url(#quiet-center-mark)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M77 151.5A49 49 0 0 1 117 71"
                fill="none"
                stroke="#e9e0c9"
                strokeOpacity=".52"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="120" cy="120" r="13" fill="#e2c27f" />
              <circle cx="120" cy="120" r="5" fill="#fff7e5" />
            </g>
            <circle cx="169" cy="54" r="3" fill="#f5ebcf" opacity=".78" />
          </svg>
        </div>
        <div style={{ padding: "8px 2px 0" }}>
          <div style={{ fontSize: 8, letterSpacing: ".13em", textTransform: "uppercase", color: "#74847a", fontWeight: 700 }}>
            Sacred Words · Icon Study
          </div>
          <h1 style={{ margin: "3px 0 3px", fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 20, letterSpacing: "-.035em" }}>
            Quiet Center
          </h1>
          <p style={{ margin: 0, color: "#5f7068", fontSize: 10.5, lineHeight: 1.28 }}>
            An open circle holding a point of light: a quiet moment for prayer, without tying it to one tradition.
          </p>
        </div>
      </section>
    </main>
  );
}
