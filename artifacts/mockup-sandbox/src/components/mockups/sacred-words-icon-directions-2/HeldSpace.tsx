export function HeldSpace() {
  return (
    <main
      style={{
        width: 280,
        height: 350,
        boxSizing: "border-box",
        padding: "12px",
        background: "#e9e1d5",
        color: "#382f33",
        fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <section
        aria-label="Held Space app icon concept"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          background: "#f5efe5",
          padding: "14px 14px 12px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 8px 24px rgba(63, 48, 45, .09)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: "#8b746a",
            font: "700 8px/1.2 ui-sans-serif, system-ui, sans-serif",
            letterSpacing: "1.35px",
          }}
        >
          <span style={{ width: 15, height: 1, background: "#bb765d" }} />
          SACRED WORDS · ICON STUDY
        </div>
        <div
          role="img"
          aria-label="Two curved forms shelter a quiet center"
          style={{
          marginTop: 12,
          width: 210,
          height: 210,
            flex: "0 0 auto",
          borderRadius: 46,
            overflow: "hidden",
            boxShadow: "0 12px 22px rgba(56, 43, 47, .2), 0 2px 4px rgba(56,43,47,.1)",
          }}
        >
          <svg viewBox="0 0 220 220" width="210" height="210" aria-hidden="true">
            <rect width="220" height="220" rx="48" fill="#57434a" />
            <circle cx="110" cy="108" r="76" fill="#72575a" opacity=".42" />
            <path
              d="M61 49c-17 5-25 24-20 46 6 27 27 48 57 63l9-17c-24-12-39-28-43-48-3-12 0-22 8-28-2-10-5-16-11-16Z"
              fill="#f3e8d4"
            />
            <path
              d="M159 49c17 5 25 24 20 46-6 27-27 48-57 63l-9-17c24-12 39-28 43-48 3-12 0-22-8-28 2-10 5-16 11-16Z"
              fill="#f3e8d4"
            />
            <path
              d="M79 156c9 7 20 12 31 16 11-4 22-9 31-16"
              fill="none"
              stroke="#f3e8d4"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="110" cy="108" r="10" fill="#d89a70" />
            <circle cx="110" cy="108" r="3.2" fill="#f8e3bb" />
          </svg>
        </div>
        <div style={{ alignSelf: "stretch", marginTop: 9 }}>
          <h1
            style={{
              margin: 0,
              color: "#42353a",
              fontSize: 21,
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: "-.5px",
            }}
          >
            Held Space
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              maxWidth: 225,
              color: "#746760",
              font: "400 10px/1.28 ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Two open forms make a quiet place for the words we carry.
          </p>
        </div>
        <div
          style={{
            alignSelf: "stretch",
            marginTop: "auto",
            paddingTop: 5,
            borderTop: "1px solid #e4d9ca",
            color: "#9a8174",
            font: "600 7px/1.2 ui-sans-serif, system-ui, sans-serif",
            letterSpacing: "1.2px",
          }}
        >
          OPEN · PERSONAL · SHARED
        </div>
      </section>
    </main>
  );
}
