import "./_group.css";

export function RefinedSculptedFlame() {
  return (
    <main className="sw-icon-preview">
      <section
        aria-label="Refined Sculpted Flame app icon concept"
        style={{
          width: 280,
          height: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: "16px 20px 18px",
          color: "#4c3822",
          background: "#fbf8ef",
          fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 226,
            height: 226,
            borderRadius: 52,
            overflow: "hidden",
            background: "linear-gradient(145deg, #fff9e8 0%, #f8edcf 100%)",
            boxShadow:
              "0 15px 34px rgba(124, 88, 32, .12), inset 0 1px 0 rgba(255,255,255,.92), inset 0 -2px 5px rgba(165,121,44,.08)",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 256 256"
            width="100%"
            height="100%"
            role="img"
            aria-label="A sculpted golden flame with a quiet inner light"
          >
            <defs>
              <radialGradient id="tileLight" cx="50%" cy="38%" r="76%">
                <stop offset="0%" stopColor="#fffdf2" />
                <stop offset="100%" stopColor="#f4e7c1" />
              </radialGradient>
              <linearGradient id="flameGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe77a" />
                <stop offset="28%" stopColor="#f4bf37" />
                <stop offset="66%" stopColor="#d98b18" />
                <stop offset="100%" stopColor="#a95616" />
              </linearGradient>
              <linearGradient id="flameEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b96819" />
                <stop offset="36%" stopColor="#ffd857" />
                <stop offset="58%" stopColor="#fff1a2" />
                <stop offset="100%" stopColor="#c77b1d" />
              </linearGradient>
              <linearGradient id="innerLight" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#fffef1" />
                <stop offset="54%" stopColor="#fff2b7" />
                <stop offset="100%" stopColor="#f5bd43" />
              </linearGradient>
              <filter id="flameShadow" x="-30%" y="-20%" width="160%" height="160%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dy="4" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope=".18" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="256" height="256" rx="56" fill="url(#tileLight)" />
            <circle cx="128" cy="126" r="80" fill="#fff8df" opacity=".22" />
            <g filter="url(#flameShadow)">
              <path
                d="M128 42
                  C123 62 105 81 100 103
                  C95 124 101 143 89 161
                  C77 178 70 192 74 207
                  C80 230 101 241 128 242
                  C155 241 176 230 182 207
                  C186 192 179 178 167 161
                  C155 143 161 124 156 103
                  C151 81 133 62 128 42Z"
                fill="url(#flameGold)"
                stroke="#c88120"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M128 57
                  C123 78 111 94 110 113
                  C109 132 118 144 113 160
                  C109 173 98 184 97 198
                  C95 218 108 229 128 231
                  C148 229 161 218 159 198
                  C158 184 147 173 143 160
                  C138 144 147 132 146 113
                  C145 94 133 78 128 57Z"
                fill="none"
                stroke="url(#flameEdge)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity=".82"
              />
              <path
                d="M128 135
                  C124 151 114 162 112 177
                  C109 195 115 211 128 222
                  C141 211 147 195 144 177
                  C142 162 132 151 128 135Z"
                fill="url(#innerLight)"
                stroke="#fff8d8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M127 162 C121 178 121 193 128 207"
                fill="none"
                stroke="#fffef0"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity=".82"
              />
            </g>
          </svg>
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 17,
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: "-.02em",
            }}
          >
            Refined Sculpted Flame
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 238,
              color: "#877557",
              fontSize: 11,
              lineHeight: 1.45,
              letterSpacing: ".005em",
            }}
          >
            A tighter silhouette with fewer wisps makes the golden flame read at a glance.
          </p>
        </div>
      </section>
    </main>
  );
}
