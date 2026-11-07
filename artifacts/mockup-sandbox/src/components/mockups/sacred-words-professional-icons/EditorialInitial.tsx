export function EditorialInitial() {
  return (
    <main
      style={{
        width: 280,
        height: 350,
        transform: "scale(1.65)",
        transformOrigin: "top left",
        boxSizing: "border-box",
        padding: "13px 16px 12px",
        overflow: "hidden",
        background: "#eee9df",
        color: "#302b35",
        fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#81796e",
          fontSize: 7.5,
          fontWeight: 700,
          letterSpacing: "1.45px",
          lineHeight: 1,
        }}
      >
        <span style={{ width: 16, height: 1, background: "#a77b55" }} />
        SACRED WORDS · ICON STUDY
      </div>

      <div
        role="img"
        aria-label="A single warm ivory S lettermark on a deep aubergine app icon"
        style={{
          width: 214,
          height: 214,
          flex: "0 0 auto",
          marginTop: 12,
          borderRadius: 47,
          overflow: "hidden",
          boxShadow: "0 14px 27px rgba(48, 39, 46, .2), 0 2px 5px rgba(48, 39, 46, .1)",
        }}
      >
        <svg viewBox="0 0 240 240" width="214" height="214" aria-hidden="true">
          <defs>
            <linearGradient id="editorial-tile" x1="18" y1="10" x2="220" y2="232" gradientUnits="userSpaceOnUse">
              <stop stopColor="#51404a" />
              <stop offset="1" stopColor="#352a34" />
            </linearGradient>
            <linearGradient id="editorial-ink" x1="81" y1="41" x2="166" y2="197" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f4ead5" />
              <stop offset="1" stopColor="#d9c7a8" />
            </linearGradient>
          </defs>
          <rect width="240" height="240" rx="54" fill="url(#editorial-tile)" />
          <rect x="14" y="14" width="212" height="212" rx="43" fill="none" stroke="#e7d8c0" strokeOpacity=".12" />
          <text
            x="120"
            y="176"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontSize="184"
            fontWeight="400"
            fill="url(#editorial-ink)"
            letterSpacing="-10"
          >
            S
          </text>
        </svg>
      </div>

      <div style={{ alignSelf: "stretch", marginTop: 10 }}>
        <div
          style={{
            marginBottom: 4,
            color: "#9a7052",
            fontSize: 7.5,
            fontWeight: 700,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
          }}
        >
          A considered initial
        </div>
        <h1
          style={{
            margin: 0,
            color: "#302b35",
            fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
            fontSize: 20,
            lineHeight: 1.05,
            letterSpacing: "-.35px",
            fontWeight: 500,
          }}
        >
          Editorial Initial
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: 248,
            color: "#6e6967",
            fontSize: 10.5,
            lineHeight: 1.28,
            letterSpacing: ".01em",
          }}
        >
          One assured S, drawn from the language of book covers: distinctive, legible, and open to every tradition.
        </p>
      </div>
    </main>
  );
}
