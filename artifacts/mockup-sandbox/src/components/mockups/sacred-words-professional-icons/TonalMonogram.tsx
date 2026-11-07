import type { CSSProperties } from "react";

export function TonalMonogram() {
  return (
    <main style={styles.stage}>
      <section style={styles.card} aria-label="Tonal Monogram app icon concept">
        <div style={styles.eyebrow}>
          <span style={styles.rule} />
          SACRED WORDS <span style={styles.dot}>/</span> ICON STUDY
        </div>

        <div
          role="img"
          aria-label="Interlocking S and W lettermark in warm ivory on a tonal deep plum field"
          style={styles.tile}
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="tonal-field" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#514354" />
                <stop offset=".55" stopColor="#403747" />
                <stop offset="1" stopColor="#332f3c" />
              </linearGradient>
              <linearGradient id="tonal-letter" x1="0" y1="0" x2=".9" y2="1">
                <stop offset="0" stopColor="#f5eddc" />
                <stop offset="1" stopColor="#d9c9a7" />
              </linearGradient>
              <filter id="letter-depth" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#201d27" floodOpacity=".22" />
              </filter>
            </defs>
            <rect width="240" height="240" rx="54" fill="url(#tonal-field)" />
            <path d="M30 57C63 27 177 25 210 62M30 183c37 31 143 33 180-2" fill="none" stroke="#f2e8d6" strokeOpacity=".08" strokeWidth="1" />
            <path d="M31 81C55 47 87 35 119 35c33 0 66 12 90 46" fill="none" stroke="#e2d6c5" strokeOpacity=".10" strokeWidth="1" />
            <g filter="url(#letter-depth)" fill="url(#tonal-letter)">
              <text
                x="42"
                y="160"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="132"
                fontWeight="400"
                letterSpacing="-12"
              >
                S
              </text>
              <text
                x="101"
                y="158"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="96"
                fontWeight="400"
                letterSpacing="-8"
              >
                W
              </text>
            </g>
            <path d="M55 185h130" stroke="#d5bd8f" strokeOpacity=".62" strokeWidth="1" />
            <circle cx="120" cy="185" r="2" fill="#e4d1a8" />
          </svg>
        </div>

        <div style={styles.copy}>
          <div style={styles.kicker}>A mark made of words</div>
          <h1 style={styles.title}>Tonal Monogram</h1>
          <p style={styles.rationale}>
            An assured S/W letterform leads; a restrained mineral field adds depth without competing.
          </p>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  stage: {
    width: 280,
    height: 350,
    transform: "scale(1.65)",
    transformOrigin: "top left",
    boxSizing: "border-box",
    padding: "12px 10px 10px",
    overflow: "hidden",
    background: "#e9e3d8",
    color: "#373440",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: 260,
    height: 330,
    boxSizing: "border-box",
    padding: "11px 13px 10px",
    borderRadius: 15,
    background: "#f5f0e6",
    boxShadow: "0 8px 24px rgba(62, 53, 58, .10), 0 1px 2px rgba(62, 53, 58, .08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  eyebrow: {
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1.2px",
    color: "#79736f",
    lineHeight: "12px",
  },
  rule: { width: 18, height: 1, background: "#a78061" },
  dot: { color: "#b18d67", marginLeft: -4, marginRight: -4 },
  tile: {
    width: 210,
    height: 210,
    flex: "0 0 auto",
    marginTop: 9,
    borderRadius: 42,
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(50, 42, 51, .21), 0 2px 4px rgba(50, 42, 51, .12)",
  },
  copy: { alignSelf: "stretch", marginTop: 8 },
  kicker: {
    color: "#9a795c",
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.25px",
    lineHeight: "10px",
  },
  title: {
    margin: "1px 0 0",
    color: "#393440",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 19,
    fontWeight: 500,
    lineHeight: 1.12,
    letterSpacing: "-.45px",
  },
  rationale: {
    margin: "3px 0 0",
    color: "#6e6b68",
    fontSize: 10,
    lineHeight: 1.28,
    letterSpacing: ".01em",
  },
};
