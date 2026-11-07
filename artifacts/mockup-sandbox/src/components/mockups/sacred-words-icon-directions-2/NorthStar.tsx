import type { CSSProperties } from "react";

export function NorthStar() {
  return (
    <main style={styles.stage}>
      <article style={styles.card} aria-label="Sacred Words Guide Star icon concept">
        <div style={styles.kicker}>
          <span style={styles.rule} />
          SACRED WORDS <span style={styles.dot}>·</span> ICON STUDY 06
        </div>
        <div
          role="img"
          aria-label="A calm, four-point guide star nested in an open circular path"
          style={styles.iconTile}
        >
          <svg viewBox="0 0 220 220" width="210" height="210" aria-hidden="true">
            <rect width="220" height="220" rx="50" fill="#315451" />
            <circle cx="110" cy="110" r="73" fill="none" stroke="#e8deca" strokeOpacity=".15" strokeWidth="1.5" />
            <path
              d="M110 39c-7 35-19 57-46 71 27 14 39 36 46 71 7-35 19-57 46-71-27-14-39-36-46-71Z"
              fill="#f3d69b"
            />
            <path d="M110 60c-4.5 26-13 42-32 50 19 8 27.5 24 32 50 4.5-26 13-42 32-50-19-8-27.5-24-32-50Z" fill="#fff2d2" />
            <circle cx="110" cy="110" r="7" fill="#bd805d" />
            <path d="M52 153a69 69 0 0 0 111 6" fill="none" stroke="#d8c9a8" strokeWidth="2" strokeLinecap="round" opacity=".75" />
            <circle cx="55" cy="151" r="3.5" fill="#e6b782" />
          </svg>
        </div>
        <div style={styles.copy}>
          <div style={styles.index}>06 <span /> DIRECTION</div>
          <h1 style={styles.title}>Guide Star</h1>
          <p style={styles.rationale}>
            A steady point of light, framed by an unfinished orbit: find a way into the words you need.
          </p>
        </div>
      </article>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  stage: {
    width: 280,
    height: 350,
    boxSizing: "border-box",
    padding: "12px",
    display: "flex",
    justifyContent: "center",
    background: "#e9e3d5",
    color: "#283d3b",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
    overflow: "hidden",
  },
  card: {
    width: 256,
    height: 326,
    boxSizing: "border-box",
    padding: "14px 14px 12px",
    borderRadius: 24,
    background: "#f5f1e7",
    boxShadow: "0 9px 25px rgba(44, 58, 51, .10), 0 1px 2px rgba(44, 58, 51, .08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  kicker: {
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    color: "#7b8071",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1.15px",
  },
  rule: { width: 14, height: 1, background: "#bb8a60" },
  dot: { color: "#b38c67", margin: "0 -3px" },
  iconTile: {
    width: 210,
    height: 210,
    flex: "0 0 auto",
    marginTop: 12,
    borderRadius: 46,
    overflow: "hidden",
    boxShadow: "0 11px 23px rgba(39, 64, 59, .2), 0 2px 5px rgba(39, 64, 59, .1)",
  },
  copy: { alignSelf: "stretch", marginTop: 9 },
  index: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#8a8272",
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "1.4px",
  },
  title: {
    margin: "3px 0 3px",
    color: "#29423e",
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontSize: 21,
    lineHeight: 1.04,
    fontWeight: 500,
    letterSpacing: "-.45px",
  },
  rationale: {
    margin: 0,
    color: "#69766d",
    fontSize: 10,
    lineHeight: 1.28,
    letterSpacing: ".02px",
  },
};
