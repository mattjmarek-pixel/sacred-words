import type { CSSProperties } from "react";
import "./_group.css";

export function OpenPageQuote() {
  return (
    <main className="sw-brand-direction" style={styles.stage}>
      <section style={styles.card} aria-label="Open-Page Quotemark app icon concept">
        <div style={styles.eyebrow}>
          <span style={styles.eyebrowLine} />
          SACRED WORDS · ICON STUDY 04
        </div>

        <div style={styles.tile} role="img" aria-label="An open book with a quotation mark rising from its center">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            aria-hidden="true"
            style={styles.mark}
          >
            <defs>
              <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#234c4b" />
                <stop offset="1" stopColor="#173a3b" />
              </linearGradient>
              <linearGradient id="paper" x1="0" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#fff9e9" />
                <stop offset="1" stopColor="#eadfbd" />
              </linearGradient>
              <linearGradient id="pageRight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f8efd9" />
                <stop offset="1" stopColor="#ded0aa" />
              </linearGradient>
              <filter id="markShadow" x="-25%" y="-25%" width="150%" height="160%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0c2727" floodOpacity=".25" />
              </filter>
            </defs>

            <rect x="1" y="1" width="198" height="198" rx="43" fill="url(#tile)" />
            <circle cx="100" cy="92" r="62" fill="#426b63" opacity=".23" />
            <g filter="url(#markShadow)">
              <path
                d="M37 94.5c20-8 41-6 63 7.5v55c-22-13.2-43-15.8-63-8.1V94.5Z"
                fill="url(#paper)"
                stroke="#f9f1dc"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M163 94.5c-20-8-41-6-63 7.5v55c22-13.2 43-15.8 63-8.1V94.5Z"
                fill="url(#pageRight)"
                stroke="#f9f1dc"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d="M100 103v53" stroke="#bba977" strokeWidth="2" opacity=".8" />
              <path d="M48 107c14-3.5 27-1.7 39 4.5M48 119c13-2.8 25-1.1 37 4.4M48 131c12-1.8 24-.2 35 4.5" stroke="#b9ad8c" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
              <path d="M152 107c-9.2-2.3-18-2.3-26.6 0" stroke="#b9ad8c" strokeWidth="2.2" strokeLinecap="round" opacity=".56" />
              <path d="M152 119c-7.5-1.7-14.3-1.8-20.8-.4" stroke="#b9ad8c" strokeWidth="2.2" strokeLinecap="round" opacity=".48" />
            </g>

            <path
              d="M111.5 52.5c0-7.6 5.4-12.8 13.2-12.8 7.1 0 12.2 4.9 12.2 11.4 0 7.3-5 12.8-13.2 18.1l-8.1 5.2v-9.1c4.1-2.8 6.5-4.7 7.7-6.3-6.9-.6-11.8-2.6-11.8-6.5Z"
              fill="#dfb968"
            />
            <path
              d="M143.7 52.5c0-7.6 5.4-12.8 13.2-12.8 7.1 0 12.2 4.9 12.2 11.4 0 7.3-5 12.8-13.2 18.1l-8.1 5.2v-9.1c4.1-2.8 6.5-4.7 7.7-6.3-6.9-.6-11.8-2.6-11.8-6.5Z"
              fill="#dfb968"
            />
            <path d="M119 79.5c8.6 2.6 17 2.6 25.6 0" fill="none" stroke="#dfb968" strokeWidth="2" strokeLinecap="round" opacity=".78" />
          </svg>
          <span style={styles.tileIndex}>04</span>
        </div>

        <div style={styles.copy}>
          <h1 style={styles.title}>Open-Page<br />Quotemark</h1>
          <p style={styles.rationale}>
            An open book and a rising quotation mark join sacred text with the words we offer in prayer.
          </p>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  stage: {
    minHeight: 350,
    height: 350,
    background: "#e9e5d8",
    padding: 10,
    fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
    color: "#243a37",
  },
  card: {
    width: 260,
    height: 330,
    padding: "12px 14px 10px",
    borderRadius: 18,
    background: "#f5f1e6",
    boxShadow: "0 12px 34px rgba(53, 66, 54, .12), 0 1px 2px rgba(53, 66, 54, .10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  eyebrow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#748078",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.35px",
    whiteSpace: "nowrap",
  },
  eyebrowLine: {
    width: 20,
    height: 1,
    background: "#c6a65f",
    display: "inline-block",
  },
  tile: {
    position: "relative",
    marginTop: 9,
    width: 190,
    height: 190,
    flex: "0 0 auto",
    borderRadius: 40,
    overflow: "hidden",
    boxShadow: "0 11px 22px rgba(25, 54, 50, .18)",
  },
  mark: {
    display: "block",
    width: 190,
    height: 190,
  },
  tileIndex: {
    position: "absolute",
    right: 13,
    bottom: 11,
    color: "#dfd7bf",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1px",
    opacity: 0.65,
  },
  copy: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  title: {
    margin: 0,
    color: "#24413d",
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 20,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: "-.45px",
  },
  rationale: {
    margin: "5px 0 0",
    maxWidth: 232,
    color: "#68736b",
    fontSize: 11.5,
    lineHeight: 1.3,
    letterSpacing: ".03px",
  },
};
