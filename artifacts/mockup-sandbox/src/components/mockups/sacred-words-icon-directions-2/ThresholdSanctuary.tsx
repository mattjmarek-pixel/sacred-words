export function ThresholdSanctuary() {
  return (
    <main
      style={{
        width: 280,
        height: 350,
        boxSizing: "border-box",
        padding: "14px 16px 12px",
        overflow: "hidden",
        background: "#e9e5d9",
        color: "#263b3c",
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
          gap: 6,
          color: "#77776b",
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: "1.5px",
          lineHeight: 1,
        }}
      >
        <span style={{ width: 15, height: 1, background: "#bd8956" }} />
        SACRED WORDS · ICON STUDY
      </div>

      <div
        role="img"
        aria-label="A warm stone-colored arch opening into a quiet, deep teal sanctuary"
        style={{
          width: 214,
          height: 214,
          flex: "0 0 auto",
          marginTop: 12,
          borderRadius: 47,
          overflow: "hidden",
          boxShadow: "0 14px 28px rgba(39, 54, 51, .18), 0 2px 4px rgba(39, 54, 51, .08)",
        }}
      >
        <svg viewBox="0 0 240 240" width="214" height="214" aria-hidden="true">
          <rect width="240" height="240" rx="54" fill="#294849" />
          <path
            d="M49 191V105C49 65.8 80.8 34 120 34s71 31.8 71 71v86H49Z
               M79 191V105c0-22.6 18.4-41 41-41s41 18.4 41 41v86H79Z"
            fill="#e8d6b4"
            fillRule="evenodd"
          />
          <path d="M82 191V106c0-21 17-38 38-38s38 17 38 38v85H82Z" fill="#294849" />
          <path d="M66 191h108" fill="none" stroke="#e8d6b4" strokeWidth="10" strokeLinecap="round" />
          <path d="M120 171v11" fill="none" stroke="#d6a66f" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>

        <div style={{ alignSelf: "stretch", marginTop: 10 }}>
        <div
          style={{
            marginBottom: 5,
            color: "#a1724d",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "1.35px",
            textTransform: "uppercase",
          }}
        >
          A place to return to
        </div>
        <h1
          style={{
            margin: 0,
            color: "#263b3c",
            fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
            fontSize: 20,
            lineHeight: 1.04,
            letterSpacing: "-.4px",
            fontWeight: 500,
          }}
        >
          Threshold Sanctuary
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: 250,
            color: "#626d67",
            fontSize: 10,
            lineHeight: 1.28,
            letterSpacing: ".01em",
          }}
        >
          A simple stone arch frames a private stillness—an open welcome, with no single tradition at its center.
        </p>
      </div>
    </main>
  );
}
