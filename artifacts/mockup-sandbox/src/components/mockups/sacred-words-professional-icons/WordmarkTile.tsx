import type { CSSProperties } from "react";

export function WordmarkTile() {
  return (
    <main style={styles.stage}>
      <section style={styles.card} aria-label="Sacred Words — Imprint wordmark app icon concept">
        <div style={styles.eyebrow}>
          <span style={styles.rule} />
          SACRED WORDS&nbsp; · &nbsp;ICON STUDY 01
        </div>

        <div
          role="img"
          aria-label="A deep ink-green app tile bearing the words Sacred Words in a confident cream serif wordmark"
          style={styles.tile}
        >
          <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="imprint-ground" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#31564c" />
                <stop offset="1" stopColor="#203d38" />
              </linearGradient>
              <linearGradient id="imprint-type" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4edda" />
                <stop offset="1" stopColor="#dfd0a9" />
              </linearGradient>
            </defs>
            <rect width="240" height="240" rx="53" fill="url(#imprint-ground)" />
            <path d="M34 44h172M34 196h172" stroke="#e6d7b1" strokeWidth="1" opacity=".34" />
            <path d="M43 50h154M43 190h154" stroke="#e6d7b1" strokeWidth=".7" opacity=".15" />
            <text
              x="120"
              y="108"
              textAnchor="middle"
              fill="url(#imprint-type)"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontWeight="600"
              fontSize="28"
              letterSpacing="-1.2"
            >
              Sacred
            </text>
            <text
              x="120"
              y="148"
              textAnchor="middle"
              fill="url(#imprint-type)"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontWeight="600"
              fontSize="28"
              letterSpacing="-1.2"
            >
              Words
            </text>
            <path d="M101 169h38" stroke="#c7a66b" strokeWidth="2" />
            <circle cx="120" cy="169" r="2.2" fill="#e8d9b4" />
          </svg>
        </div>

        <div style={styles.copy}>
          <div style={styles.kicker}>TYPE-FIRST · IMPRINT</div>
          <h1 style={styles.title}>The Imprint</h1>
          <p style={styles.rationale}>
            The name becomes the mark: a clear, bookish wordmark held in a quiet field of evergreen ink.
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
    padding: "12px 10px",
    background: "#e8e4d8",
    display: "flex",
    justifyContent: "center",
    color: "#253d38",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  card: {
    width: 260,
    height: 326,
    boxSizing: "border-box",
    padding: "11px 13px 10px",
    borderRadius: 15,
    background: "#f5f1e7",
    boxShadow: "0 10px 26px rgba(39, 52, 45, .10), 0 1px 2px rgba(39, 52, 45, .08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  eyebrow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "#77786e",
    fontSize: 8,
    lineHeight: 1.2,
    letterSpacing: "1.15px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  rule: {
    display: "inline-block",
    width: 17,
    height: 1,
    marginRight: 7,
    background: "#b28a50",
  },
  tile: {
    width: 212,
    height: 212,
    flex: "0 0 auto",
    marginTop: 10,
    borderRadius: 45,
    overflow: "hidden",
    boxShadow: "0 13px 25px rgba(36, 59, 52, .19), 0 2px 5px rgba(36, 59, 52, .10)",
  },
  copy: {
    alignSelf: "stretch",
    marginTop: 10,
  },
  kicker: {
    marginBottom: 3,
    color: "#a17b48",
    fontSize: 7,
    lineHeight: 1,
    letterSpacing: "1.15px",
    fontWeight: 700,
  },
  title: {
    margin: 0,
    color: "#263e38",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 19,
    lineHeight: 1.1,
    letterSpacing: "-.35px",
    fontWeight: 600,
  },
  rationale: {
    margin: "4px 0 0",
    color: "#68716a",
    fontSize: 10,
    lineHeight: 1.3,
    letterSpacing: ".01em",
  },
};
