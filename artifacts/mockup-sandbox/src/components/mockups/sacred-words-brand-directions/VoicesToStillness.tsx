import "./_group.css";

export function VoicesToStillness() {
  return (
    <main className="sw-brand-direction vts-stage">
      <article className="vts-card" aria-label="Voices to Stillness app icon concept">
        <div className="vts-icon-wrap">
          <svg
            className="vts-icon"
            viewBox="0 0 200 200"
            role="img"
            aria-label="Short lines of many voices meeting at one quiet point"
          >
            <defs>
              <linearGradient id="vts-tile" x1="18" y1="12" x2="177" y2="188" gradientUnits="userSpaceOnUse">
                <stop stopColor="#394C55" />
                <stop offset="1" stopColor="#20343B" />
              </linearGradient>
              <radialGradient id="vts-center" cx="0" cy="0" r="1" gradientTransform="matrix(0 13 -13 0 100 107)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5D9A0" />
                <stop offset="1" stopColor="#E7B976" />
              </radialGradient>
            </defs>
            <rect width="200" height="200" rx="46" fill="url(#vts-tile)" />
            <circle cx="100" cy="105" r="61" fill="#E6D9C5" fillOpacity=".035" />
            <g transform="translate(100 105) scale(1.3) translate(-100 -105)" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M47 61h19c13 0 24 6 34 17" stroke="#D5BDA0" strokeWidth="6" />
              <path d="M38 82h28c12 0 22 5 33 14" stroke="#D6A88F" strokeWidth="6" />
              <path d="M44 104h25c11 0 20 2 30 3" stroke="#E5C985" strokeWidth="6" />
              <path d="M53 126h17c12 0 21-3 30-9" stroke="#C9D4C9" strokeWidth="6" />
              <path d="M153 61h-19c-13 0-24 6-34 17" stroke="#C9D4C9" strokeWidth="6" />
              <path d="M162 82h-28c-12 0-22 5-33 14" stroke="#E5C985" strokeWidth="6" />
              <path d="M156 104h-25c-11 0-20 2-30 3" stroke="#D6A88F" strokeWidth="6" />
              <path d="M147 126h-17c-12 0-21-3-30-9" stroke="#D5BDA0" strokeWidth="6" />
            </g>
            <circle cx="100" cy="107" r="8" fill="url(#vts-center)" />
            <circle cx="100" cy="107" r="3" fill="#FFF1D5" />
          </svg>
        </div>
        <div className="vts-copy">
          <div className="vts-kicker"><span /> SACRED WORDS · ICON STUDY 04</div>
          <h1>Voices to Stillness</h1>
          <p>Short word-like strokes gather at one quiet point: many kinds of prayer becoming a moment of reflection.</p>
        </div>
      </article>
      <style>{`
        .vts-stage {
          min-height: 350px;
          padding: 10px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 10%, rgba(211, 190, 159, .18), transparent 62%),
            #e9e4d9;
          color: #24363b;
          font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
        }
        .vts-card {
          width: 100%;
          max-width: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          text-align: center;
          animation: vts-arrive 650ms cubic-bezier(.2,.75,.25,1) both;
        }
        .vts-icon-wrap {
          width: 200px;
          height: 200px;
          flex: 0 0 auto;
          filter: drop-shadow(0 12px 14px rgba(44, 54, 52, .18));
          animation: vts-settle 800ms 120ms cubic-bezier(.2,.75,.25,1) both;
        }
        .vts-icon { display: block; width: 100%; height: 100%; }
        .vts-copy { width: 100%; }
        .vts-kicker {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-bottom: 5px;
          color: #7d786b;
          font: 600 9px/1.2 "Avenir Next", "Segoe UI", sans-serif;
          letter-spacing: .13em;
        }
        .vts-kicker span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #bd8d59;
        }
        .vts-copy h1 {
          margin: 0;
          color: #283b3f;
          font: 500 20px/1.12 "Iowan Old Style", "Palatino Linotype", Georgia, serif;
          letter-spacing: -.035em;
        }
        .vts-copy p {
          max-width: 250px;
          margin: 5px auto 0;
          color: #64685f;
          font: 400 11.5px/1.35 "Avenir Next", "Segoe UI", sans-serif;
          letter-spacing: .005em;
        }
        @keyframes vts-arrive {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes vts-settle {
          from { opacity: 0; transform: scale(.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vts-card, .vts-icon-wrap { animation: none; }
        }
      `}</style>
    </main>
  );
}
