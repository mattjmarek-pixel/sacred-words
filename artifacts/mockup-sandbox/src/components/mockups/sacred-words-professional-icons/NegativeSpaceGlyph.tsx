import type { CSSProperties } from "react";

export function NegativeSpaceGlyph() {
  return (
    <main style={styles.stage}>
      <section style={styles.card} aria-label="Negative-space glyph app icon concept">
        <div style={styles.eyebrow}>
          <span style={styles.rule} />
          SACRED WORDS <span style={styles.dot}>/</span> ICON STUDY 07
        </div>

        <div
          role="img"
          aria-label="A warm ivory S-shaped channel cut through a sculptural brass monogram on a deep evergreen tile"
          style={styles.tile}
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="cutout-ground" x1="16" y1="10" x2="222" y2="232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#294b46" />
                <stop offset="1" stopColor="#183532" />
              </linearGradient>
              <linearGradient id="cutout-brass" x1="57" y1="37" x2="180" y2="207" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f0dfb8" />
                <stop offset=".5" stopColor="#d8bd85" />
                <stop offset="1" stopColor="#b89a64" />
              </linearGradient>
              <filter id="cutout-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0c211e" floodOpacity=".26" />
              </filter>
            </defs>
            <rect width="240" height="240" rx="54" fill="url(#cutout-ground)" />
            <path
              d="M120 35c-39 0-68 19-68 51 0 25 18 38 51 49l33 11c13 4 19 10 19 19 0 11-13 19-34 19-24 0-43-9-60-27l-21 24c20 23 48 35 81 35 42 0 71-20 71-54 0-27-18-42-52-53l-32-10c-13-4-19-9-19-17 0-9 11-15 29-15 20 0 37 7 52 20l19-24c-19-18-41-28-69-28Z"
              fill="url(#cutout-brass)"
              filter="url(#cutout-shadow)"
            />
            <path
              d="M91 57c-16 4-25 13-25 26 0 10 8 17 24 23l52 18c26 9 39 22 39 42 0 7-2 14-5 20"
              fill="none"
              stroke="#f6eccf"
              strokeOpacity=".34"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              fill="url(#cutout-ground)"
              fillRule="evenodd"
              d="M120 35c-39 0-68 19-68 51 0 25 18 38 51 49l33 11c13 4 19 10 19 19 0 11-13 19-34 19-24 0-43-9-60-27l-21 24c20 23 48 35 81 35 42 0 71-20 71-54 0-27-18-42-52-53l-32-10c-13-4-19-9-19-17 0-9 11-15 29-15 20 0 37 7 52 20l19-24c-19-18-41-28-69-28Z
                M119 71c-19 0-31 7-31 18 0 6 5 10 16 14l34 11c17 5 26 15 26 28 0 20-17 32-44 32-16 0-31-4-45-14l15-17c9 6 19 9 30 9 11 0 17-3 17-8 0-4-4-6-13-9l-33-11c-19-6-29-16-29-31 0-27 23-44 58-44 17 0 33 4 47 13l-14 18c-10-6-22-9-34-9Z"
            />
            <path d="M120 35c28 0 50 10 69 28" fill="none" stroke="#f5e9c9" strokeOpacity=".36" strokeWidth="1.4" />
          </svg>
        </div>

        <div style={styles.copy}>
          <div style={styles.kicker}>FORM STUDY · NEGATIVE SPACE</div>
          <h1 style={styles.title}>The Quiet Cut</h1>
          <p style={styles.rationale}>
            A single S-shaped channel is carved from a solid mark—recognition built from the pause, not an illustration.
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
    background: "#e9e4d8",
    display: "flex",
    justifyContent: "center",
    color: "#263d39",
    fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
  },
  card: {
    width: 260,
    height: 328,
    boxSizing: "border-box",
    padding: "8px 12px 10px",
    borderRadius: 16,
    background: "#f5f1e7",
    boxShadow: "0 8px 24px rgba(53, 61, 50, .09), 0 1px 2px rgba(53, 61, 50, .08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  eyebrow: {
    alignSelf: "stretch",
    height: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#77796d",
    fontSize: 8,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "1.05px",
    whiteSpace: "nowrap",
  },
  rule: { width: 17, height: 1, background: "#b49761", flex: "0 0 auto" },
  dot: { color: "#b49761", margin: "0 -3px" },
  tile: {
    width: 220,
    height: 220,
    flex: "0 0 auto",
    marginTop: 8,
    borderRadius: 48,
    overflow: "hidden",
    boxShadow: "0 12px 25px rgba(34, 55, 49, .2), 0 2px 5px rgba(34, 55, 49, .08)",
  },
  copy: { alignSelf: "stretch", marginTop: 9 },
  kicker: {
    color: "#a17c4f",
    fontSize: 7,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "1.1px",
  },
  title: {
    margin: "3px 0 0",
    color: "#283c38",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 20,
    lineHeight: 1.05,
    letterSpacing: "-.45px",
    fontWeight: 500,
  },
  rationale: {
    margin: "4px 0 0",
    maxWidth: 234,
    color: "#66716a",
    fontSize: 10,
    lineHeight: 1.28,
    letterSpacing: ".01em",
  },
};
