import "./_group.css";

export function BalancedFlame() {
  return (
    <main className="sw-icon-preview" style={{ background: "#eee8d8", padding: 18 }}>
      <div
        style={{
          width: 240,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 13,
          color: "#453a27",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 232,
            height: 232,
            borderRadius: 52,
            background: "linear-gradient(145deg, #fff9e8 0%, #f7edcf 100%)",
            boxShadow: "0 16px 35px rgba(89, 70, 29, .13), inset 0 1px 0 rgba(255,255,255,.9)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="190" height="190" viewBox="0 0 200 200" role="img" aria-label="Balanced golden flame">
            <defs>
              <linearGradient id="flameGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f9dc72" />
                <stop offset=".48" stopColor="#e9ad35" />
                <stop offset="1" stopColor="#bd7620" />
              </linearGradient>
              <linearGradient id="innerLight" x1="0" y1="0" x2=".2" y2="1">
                <stop offset="0" stopColor="#fff5c8" />
                <stop offset="1" stopColor="#f2c75e" />
              </linearGradient>
              <filter id="softShadow" x="-30%" y="-20%" width="160%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#a56d1f" floodOpacity=".18" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="78" fill="none" stroke="#e7c77b" strokeOpacity=".32" strokeWidth="1.5" />
            <path
              d="M100 27 C89 45 75 57 72 76 C58 86 54 104 59 122 C64 144 79 159 100 166 C121 159 136 144 141 122 C146 104 142 86 128 76 C125 57 111 45 100 27Z"
              fill="url(#flameGold)"
              filter="url(#softShadow)"
            />
            <path
              d="M100 47 C94 62 84 73 84 87 C73 98 72 112 78 125 C82 136 90 144 100 149 C110 144 118 136 122 125 C128 112 127 98 116 87 C116 73 106 62 100 47Z"
              fill="url(#innerLight)"
            />
            <path d="M100 148 C96 154 96 160 100 165 C104 160 104 154 100 148Z" fill="#b97725" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".01em" }}>Balanced Flame</div>
          <div style={{ marginTop: 4, fontSize: 10.5, lineHeight: 1.45, color: "#766a53" }}>
            A centered, even silhouette with a clear, quiet wick.
          </div>
        </div>
      </div>
    </main>
  );
}
