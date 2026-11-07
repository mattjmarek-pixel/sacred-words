export function PrayerCairn() {
  return (
    <main
      style={{
        width: 280,
        height: 350,
        boxSizing: "border-box",
        padding: "14px 16px 12px",
        overflow: "hidden",
        background: "#eeeadf",
        color: "#263e3c",
        fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#827d6f",
          fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "1.3px",
        }}
      >
        <span style={{ width: 22, height: 1, background: "#b28d52" }} />
        SACRED WORDS · ICON STUDY
      </div>

      <div
        role="img"
        aria-label="A balanced stack of three abstract stone forms on a deep evergreen app icon"
        style={{
          width: 214,
          height: 214,
          margin: "12px auto 0",
          overflow: "hidden",
          borderRadius: 47,
          boxShadow: "0 14px 27px rgba(39, 59, 54, .18), 0 2px 4px rgba(39, 59, 54, .08)",
        }}
      >
        <svg viewBox="0 0 220 220" width="214" height="214" aria-hidden="true">
          <rect width="220" height="220" rx="48" fill="#365550" />
          <circle cx="110" cy="105" r="79" fill="#6b8378" opacity=".16" />
          <path
            d="M53 152c2-10 11-17 24-19l30-4 35 4c14 2 23 9 25 19l2 7c1 7-5 12-13 12H64c-8 0-13-5-12-12l1-7Z"
            fill="#e8d8b7"
          />
          <path
            d="M74 113c1-10 10-18 21-20l15-3 18 3c12 2 21 10 22 20l1 5c1 7-5 12-12 12H85c-8 0-13-5-12-12l1-5Z"
            fill="#d1a968"
          />
          <path
            d="M91 79c1-9 8-16 18-17l5-1 7 1c10 1 17 8 18 17l1 4c0 6-4 10-10 10h-30c-6 0-10-4-10-10l1-4Z"
            fill="#f2e6cc"
          />
          <path d="M69 153c16-5 31-6 45-4" fill="none" stroke="#f7edda" strokeWidth="2" strokeLinecap="round" opacity=".68" />
          <path d="M88 113c10-3 20-4 30-2" fill="none" stroke="#f0d9aa" strokeWidth="2" strokeLinecap="round" opacity=".72" />
          <circle cx="110" cy="57" r="2" fill="#d8b77a" opacity=".9" />
        </svg>
      </div>

      <div style={{ marginTop: 10 }}>
        <h1
          style={{
            margin: 0,
            color: "#29413e",
            fontSize: 21,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-.65px",
          }}
        >
          Prayer Cairn
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: 250,
            color: "#666c62",
            fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
            fontSize: 10,
            lineHeight: 1.28,
          }}
        >
          Three steady forms, set one at a time: a small ritual for finding your center.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginTop: 7,
          color: "#8a806c",
          fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: ".8px",
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 14, height: 1, background: "#c4ad7b" }} />
        Steady · Grounded · Open
      </div>
    </main>
  );
}
