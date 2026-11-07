import "./_group.css";

export function SWPageLettermark() {
  return (
    <main className="sw-brand-direction" style={{ background: "#f1eee5", padding: 10 }}>
      <section
        aria-label="SW Page Lettermark app icon concept"
        style={{
          width: 260,
          height: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "#25382f",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            flex: "0 0 auto",
            borderRadius: 42,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(145deg, #315347 0%, #203b34 100%)",
            boxShadow: "0 16px 32px rgba(41, 61, 51, .18), inset 0 1px 0 rgba(255,255,255,.18)",
          }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 164 164"
            role="img"
            aria-label="S and W lettermark, with the W shaped like open pages"
          >
            <defs>
              <linearGradient id="sw-ink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f7edcf" />
                <stop offset="1" stopColor="#e5d6ad" />
              </linearGradient>
            </defs>
            <path
              d="M70 35c-7-8-17-12-29-12-21 0-34 12-34 29 0 18 13 25 33 31l13 4c13 4 19 8 19 17 0 10-9 16-23 16-15 0-27-6-37-18L1 120c12 16 29 24 49 24 25 0 42-13 42-33 0-18-11-27-35-34l-15-4c-11-3-16-7-16-14 0-8 7-13 18-13 9 0 17 3 24 10l2-21Z"
              fill="url(#sw-ink)"
              transform="translate(6 8) scale(.68)"
            />
            <path
              d="M77 48 94 115 113 69 132 115 150 48"
              fill="none"
              stroke="#f7edcf"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M76 48v73c7-5 13-7 18-7M151 48v73c-7-5-13-7-19-7"
              fill="none"
              stroke="#d4c28f"
              strokeWidth="3"
              strokeLinecap="round"
              opacity=".88"
            />
            <path d="M94 115c6-4 12-6 19-6 7 0 13 2 19 6" fill="none" stroke="#d4c28f" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ margin: "10px 0 4px", fontSize: 21, fontWeight: 600, letterSpacing: "-.035em" }}>
          Page Lettermark
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 250,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            fontSize: 12,
            lineHeight: 1.35,
            color: "#68756a",
          }}
        >
          The W opens into a quiet page spread, turning Sacred Words into a compact, recognizable seal.
        </p>
      </section>
    </main>
  );
}
