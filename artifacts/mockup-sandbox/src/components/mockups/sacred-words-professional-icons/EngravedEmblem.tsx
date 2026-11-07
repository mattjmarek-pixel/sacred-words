import type { CSSProperties } from "react";

export function EngravedEmblem() {
  return (
    <main style={styles.stage}>
      <section style={styles.card} aria-label="Sacred Words engraved emblem app icon concept">
        <div style={styles.eyebrow}>
          <span style={styles.rule} />
          SACRED WORDS <span style={styles.dot}>/</span> ICON STUDY
        </div>

        <div
          role="img"
          aria-label="A precise interlaced geometric emblem engraved in warm brass on deep ink teal"
          style={styles.tile}
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="engraved-tile" x1="18" y1="8" x2="221" y2="232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#284846" />
                <stop offset="1" stopColor="#1D3738" />
              </linearGradient>
              <linearGradient id="engraved-metal" x1="69" y1="52" x2="177" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8D6AC" />
                <stop offset=".48" stopColor="#C9AB70" />
                <stop offset="1" stopColor="#A98651" />
              </linearGradient>
              <filter id="engraved-shadow" x="-25%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#102726" floodOpacity=".38" />
              </filter>
            </defs>
            <rect width="240" height="240" rx="54" fill="url(#engraved-tile)" />
            <path d="M24 20h192v200H24z" fill="none" stroke="#D6C7A5" strokeOpacity=".14" strokeWidth="1" />
            <g filter="url(#engraved-shadow)" fill="url(#engraved-metal)" fillRule="evenodd">
              <path d="M78 51h20c7 0 11 4 11 11v41l-25 17 25 18v41c0 7-4 11-11 11H78c-7 0-11-4-11-11v-42l26-17-26-17V62c0-7 4-11 11-11Zm0 10c-1 0-1 1-1 2v34l37 25-37 25v34c0 1 0 2 1 2h20c1 0 1-1 1-2v-36l-34-23 34-23V63c0-1 0-2-1-2H78Z" />
              <path d="M142 51h20c7 0 11 4 11 11v41l-26 17 26 18v41c0 7-4 11-11 11h-20c-7 0-11-4-11-11v-41l25-18-25-17V62c0-7 4-11 11-11Zm0 10c-1 0-1 1-1 2v36l34 23-34 23v36c0 1 0 2 1 2h20c1 0 1-1 1-2v-34l-37-25 37-25V63c0-1 0-2-1-2h-20Z" />
            </g>
            <path d="M91 119h58" stroke="#F2E7CF" strokeOpacity=".68" strokeWidth="1.2" />
            <path d="M91 122h58" stroke="#142F2F" strokeOpacity=".55" strokeWidth="1" />
            <path d="M41 39h20M179 201h20" stroke="#D9C99F" strokeOpacity=".38" strokeWidth="1" />
          </svg>
        </div>

        <div style={styles.copy}>
          <div style={styles.kicker}>A mark made to endure</div>
          <h1 style={styles.title}>Engraved Emblem</h1>
          <p style={styles.rationale}>
            Two interlocking forms leave a quiet interval between them—a lasting sign of reflection held in common.
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
    padding: "12px 14px",
    overflow: "hidden",
    background: "#E9E5D9",
    color: "#263B3B",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: "2px 2px 0",
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
    whiteSpace: "nowrap",
    color: "#77776C",
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: "1.3px",
  },
  rule: { width: 17, height: 1, background: "#B4925E" },
  dot: { color: "#AF8D5A" },
  tile: {
    width: 218,
    height: 218,
    flex: "0 0 auto",
    marginTop: 10,
    borderRadius: 47,
    overflow: "hidden",
    boxShadow: "0 15px 28px rgba(36, 57, 53, .20), 0 2px 5px rgba(36, 57, 53, .12)",
  },
  copy: { alignSelf: "stretch", marginTop: 10 },
  kicker: {
    marginBottom: 3,
    color: "#9A7950",
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: "1.15px",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    color: "#263B3B",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 19,
    lineHeight: 1.08,
    fontWeight: 500,
    letterSpacing: "-.35px",
  },
  rationale: {
    margin: "4px 0 0",
    maxWidth: 248,
    color: "#626E68",
    fontSize: 10,
    lineHeight: 1.25,
  },
};
