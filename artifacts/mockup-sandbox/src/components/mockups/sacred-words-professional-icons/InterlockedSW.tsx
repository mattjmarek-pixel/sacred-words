import type { CSSProperties } from "react";

export function InterlockedSW() {
  return (
    <main style={styles.stage}>
      <section style={styles.card} aria-label="Interlocked SW app icon study">
        <div style={styles.eyebrow}>
          <span style={styles.rule} />
          SACRED WORDS <span style={styles.separator}>/</span> ICON STUDY 06
        </div>

        <div
          style={styles.tile}
          role="img"
          aria-label="A custom interlocked SW lettermark in pale brass on a deep ink-green tile"
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="interlock-ground" x1="25" y1="10" x2="212" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#344E48" />
                <stop offset="1" stopColor="#203833" />
              </linearGradient>
              <linearGradient id="interlock-brass" x1="64" y1="45" x2="180" y2="193" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F1E3BE" />
                <stop offset=".52" stopColor="#DCC58F" />
                <stop offset="1" stopColor="#B99A5D" />
              </linearGradient>
              <filter id="interlock-shadow" x="-25%" y="-25%" width="150%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#132924" floodOpacity=".28" />
              </filter>
            </defs>
            <rect width="240" height="240" rx="54" fill="url(#interlock-ground)" />
            <path d="M28 120h184" stroke="#D9D2BC" strokeOpacity=".09" />
            <g filter="url(#interlock-shadow)">
              {/* The S is drawn as one continuous, squared-off ribbon. Its lower turn
                  becomes the W's central valley, making the letters share a stroke. */}
              <path
                d="M148 57c-10-9-22-14-37-14-24 0-41 13-41 33 0 20 16 28 39 35l16 5c19 6 28 12 28 25 0 15-13 24-32 24-17 0-32-7-43-20l-12 12c14 17 33 26 56 26 29 0 49-16 49-41 0-22-14-33-42-41l-18-5c-15-4-23-9-23-19 0-10 9-16 23-16 11 0 21 4 30 12l7-16Z"
                fill="url(#interlock-brass)"
              />
              {/* Crisp W shoulder strokes join the letterform rather than sitting beside it. */}
              <path
                d="m42 91 19 83 25-58 25 58 19-63"
                fill="none"
                stroke="#F2E8D0"
                strokeWidth="11"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path d="M43 91h13M124 111l7-23" stroke="#F2E8D0" strokeWidth="11" strokeLinecap="square" />
              <path d="M49 96 65 164M84 126l2-5M109 164l5-16" stroke="#A98D58" strokeOpacity=".62" strokeWidth="1.5" />
            </g>
            <path d="M82 196h76" stroke="#D6C9A6" strokeOpacity=".42" strokeWidth="1" />
            <circle cx="120" cy="196" r="2" fill="#D9C590" />
          </svg>
        </div>

        <div style={styles.copy}>
          <div style={styles.kicker}>LETTERMARK · SHARED STROKE</div>
          <h1 style={styles.title}>Interlocked SW</h1>
          <p style={styles.rationale}>
            One continuous, tailored gesture lets the initials belong together—quietly distinctive, even at home-screen scale.
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
    padding: 10,
    background: "#E8E4D8",
    display: "flex",
    justifyContent: "center",
    color: "#293E39",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  card: {
    width: 260,
    height: 330,
    boxSizing: "border-box",
    borderRadius: 16,
    padding: "13px 15px 12px",
    background: "#F4F0E5",
    boxShadow: "0 9px 24px rgba(47, 57, 48, .11), 0 1px 3px rgba(47, 57, 48, .07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  eyebrow: {
    width: "100%",
    height: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#74786D",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1.2px",
    whiteSpace: "nowrap",
  },
  rule: { width: 16, height: 1, background: "#B59A64" },
  separator: { color: "#B59A64", margin: "0 -2px" },
  tile: {
    width: 214,
    height: 214,
    flex: "0 0 auto",
    marginTop: 11,
    borderRadius: 47,
    overflow: "hidden",
    boxShadow: "0 13px 26px rgba(34, 56, 49, .2), 0 2px 5px rgba(34, 56, 49, .08)",
  },
  copy: { alignSelf: "stretch", marginTop: 10 },
  kicker: {
    color: "#9B8050",
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "1.25px",
    lineHeight: 1,
  },
  title: {
    margin: "4px 0 0",
    color: "#2B403A",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 19,
    fontWeight: 600,
    lineHeight: 1.05,
    letterSpacing: "-.45px",
  },
  rationale: {
    margin: "4px 0 0",
    color: "#68736A",
    fontSize: 10,
    lineHeight: 1.3,
    letterSpacing: ".02px",
  },
};
