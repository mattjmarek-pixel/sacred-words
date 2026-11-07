import "./_group.css";

export function SharedPrayerMark() {
  return (
    <main
      className="sw-brand-direction"
      style={{
        minHeight: 350,
        width: "100%",
        padding: "12px 14px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "#f5f0e6",
        color: "#292b3b",
        fontFamily: 'Georgia, "Times New Roman", serif',
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-label="Three forms converging around a quiet center"
        role="img"
        style={{
          width: 200,
          height: 200,
          flex: "0 0 auto",
          borderRadius: 38,
          overflow: "hidden",
          boxShadow: "0 13px 25px rgba(51, 43, 67, 0.14), 0 2px 5px rgba(51, 43, 67, 0.08)",
        }}
      >
        <svg viewBox="0 0 240 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swTile" x1="24" y1="14" x2="217" y2="227" gradientUnits="userSpaceOnUse">
              <stop stopColor="#35374e" />
              <stop offset="1" stopColor="#202539" />
            </linearGradient>
            <linearGradient id="swCoral" x1="47" y1="42" x2="132" y2="174" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f4a18a" />
              <stop offset="1" stopColor="#dc786e" />
            </linearGradient>
            <linearGradient id="swSaffron" x1="180" y1="43" x2="109" y2="176" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f2cd82" />
              <stop offset="1" stopColor="#dfad63" />
            </linearGradient>
            <linearGradient id="swJade" x1="122" y1="199" x2="121" y2="79" gradientUnits="userSpaceOnUse">
              <stop stopColor="#85c4ad" />
              <stop offset="1" stopColor="#62a995" />
            </linearGradient>
          </defs>
          <rect width="240" height="240" rx="54" fill="url(#swTile)" />
          <circle cx="120" cy="120" r="75" fill="none" stroke="#c5c2bd" strokeOpacity=".12" />
          <g transform="translate(120 120) scale(1.12) translate(-120 -120)">
          <path
            d="M54 62C71 43 96 44 110 60C122 74 122 94 120 119C118 145 110 166 92 173C74 181 54 168 48 149C42 129 49 117 62 102C74 88 68 74 54 62Z"
            fill="url(#swCoral)"
          />
          <path
            d="M186 62C169 43 144 44 130 60C118 74 118 94 120 119C122 145 130 166 148 173C166 181 186 168 192 149C198 129 191 117 178 102C166 88 172 74 186 62Z"
            fill="url(#swSaffron)"
          />
          <path
            d="M120 196C97 196 82 179 83 159C84 141 100 127 120 109C140 127 156 141 157 159C158 179 143 196 120 196Z"
            fill="url(#swJade)"
          />
          <path d="M68 70C81 62 94 65 103 76" fill="none" stroke="#fff4e7" strokeOpacity=".52" strokeWidth="2" strokeLinecap="round" />
          <path d="M172 70C159 62 146 65 137 76" fill="none" stroke="#fff4e7" strokeOpacity=".52" strokeWidth="2" strokeLinecap="round" />
          <path d="M120 179C112 170 112 159 120 149" fill="none" stroke="#f1f1d9" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
          <circle cx="120" cy="119" r="7.5" fill="#fff4dc" />
          <circle cx="120" cy="119" r="3" fill="#d8a968" />
          </g>
        </svg>
      </div>
      <div style={{ width: "100%", marginTop: 8 }}>
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.35px",
            lineHeight: 1.2,
            color: "#292b3b",
          }}
        >
          Shared Prayer Mark
        </div>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: 252,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: 11.5,
            lineHeight: 1.35,
            letterSpacing: "0.04px",
            color: "#666675",
          }}
        >
          Three distinct voices gather around one still point—prayer as a practice held together.
        </p>
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 16,
          top: 18,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#cf9b73",
        }}
      />
    </main>
  );
}
