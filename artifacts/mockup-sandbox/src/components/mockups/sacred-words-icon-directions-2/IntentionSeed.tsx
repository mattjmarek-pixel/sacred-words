export function IntentionSeed() {
  return (
    <main
      style={{
        width: 280,
        height: 350,
        boxSizing: "border-box",
        padding: "14px 16px 12px",
        overflow: "hidden",
        background: "#eee9dc",
        color: "#263c3a",
        fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#7b8173",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "1.55px",
        }}
      >
        <span style={{ width: 15, height: 1, background: "#c39354" }} />
        SACRED WORDS · ICON STUDY 05
      </div>

      <div
        role="img"
        aria-label="A simple golden seed silhouette with a quiet inner seam on a deep green rounded square"
        style={{
          width: 214,
          height: 214,
          flex: "0 0 auto",
          marginTop: 12,
          borderRadius: 47,
          overflow: "hidden",
          background: "#31534e",
          boxShadow: "0 13px 25px rgba(40, 59, 53, .20), 0 2px 5px rgba(40, 59, 53, .10)",
        }}
      >
        <svg viewBox="0 0 240 240" width="100%" height="100%" aria-hidden="true">
          <rect width="240" height="240" rx="54" fill="#31534e" />
          <path
            d="M119.7 42.5C151.4 66.8 179 93.1 179 122.2c0 30.3-27.7 57.5-59.3 76.3-31.6-18.8-58.7-46-58.7-76.3 0-29.1 27.1-55.4 58.7-79.7Z"
            fill="#e8bc70"
          />
          <path
            d="M119.7 54.5c-19 21.3-34.2 43.2-34.2 67.7 0 23 15.4 43.3 34.2 58.2"
            fill="none"
            stroke="#31534e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M119.7 54.5c19 21.3 34.2 43.2 34.2 67.7 0 23-15.4 43.3-34.2 58.2"
            fill="none"
            stroke="#f4dfaf"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".92"
          />
          <circle cx="120" cy="121" r="6.5" fill="#f4dfaf" />
        </svg>
      </div>

        <div style={{ alignSelf: "stretch", marginTop: 10 }}>
        <div
          style={{
            color: "#7b8173",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "1.35px",
            textTransform: "uppercase",
          }}
        >
          Quiet growth
        </div>
        <h1
          style={{
            margin: "4px 0 0",
            color: "#263c3a",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 20,
            lineHeight: 1.04,
            fontWeight: 500,
            letterSpacing: "-.55px",
          }}
        >
          Intention Seed
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: 250,
            color: "#646d63",
            fontSize: 10,
            lineHeight: 1.28,
            letterSpacing: ".01em",
          }}
        >
          One small beginning, held in stillness. A clear, grounded mark for the practice of prayer.
        </p>
      </div>
    </main>
  );
}
