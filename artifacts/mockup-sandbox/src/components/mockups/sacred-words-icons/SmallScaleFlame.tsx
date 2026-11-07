import "./_group.css";

export function SmallScaleFlame() {
  return (
    <div className="sw-icon-preview" style={{ background: "#f4efe3", color: "#4e3820", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <section style={{ width: 240, textAlign: "center" }}>
        <div style={{ width: 224, height: 224, margin: "0 auto 18px", borderRadius: 52, overflow: "hidden", boxShadow: "0 18px 38px rgba(104, 71, 29, .16), 0 3px 8px rgba(104,71,29,.08)", background: "#fbf5df" }}>
          <svg viewBox="0 0 256 256" width="224" height="224" role="img" aria-label="A simple golden flame with a quiet halo on a cream app icon">
            <defs>
              <linearGradient id="sw-cream" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff9e8" />
                <stop offset="1" stopColor="#f2e4bd" />
              </linearGradient>
              <linearGradient id="sw-gold" x1=".2" y1="0" x2=".8" y2="1">
                <stop offset="0" stopColor="#f5d878" />
                <stop offset=".48" stopColor="#d99a2b" />
                <stop offset="1" stopColor="#9f5b1e" />
              </linearGradient>
              <linearGradient id="sw-light" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff9dd" />
                <stop offset="1" stopColor="#f4cd65" />
              </linearGradient>
              <filter id="sw-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            <rect width="256" height="256" rx="58" fill="url(#sw-cream)" />
            <circle cx="128" cy="128" r="70" fill="#e9bd53" opacity=".16" filter="url(#sw-soft)" />
            <circle cx="128" cy="128" r="64" fill="none" stroke="#d4aa54" strokeWidth="1.4" opacity=".52" />
            <path d="M128 48 C122 73 100 87 100 118 C100 130 105 139 111 146 C96 140 84 127 82 111 C63 134 57 153 60 174 C65 207 93 226 128 226 C163 226 191 207 196 174 C200 145 183 122 170 105 C168 128 158 140 145 148 C155 124 150 104 140 88 C133 76 128 64 128 48Z" fill="url(#sw-gold)" />
            <path d="M128 126 C119 142 108 151 108 170 C108 188 116 201 128 209 C140 201 148 188 148 170 C148 151 137 142 128 126Z" fill="url(#sw-light)" />
            <path d="M128 205 C124 211 124 216 128 221 C132 216 132 211 128 205Z" fill="#9f5b1e" opacity=".85" />
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: ".01em", lineHeight: 1.2 }}>Small-Scale Flame</div>
        <p style={{ margin: "7px 0 0", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, lineHeight: 1.45, color: "#79694f" }}>One clear silhouette and a single inner light for a stronger home-screen read.</p>
      </section>
    </div>
  );
}
