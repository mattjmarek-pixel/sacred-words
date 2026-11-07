import "./_group.css";

export function GoldenSealFlame() {
  return (
    <main className="sw-icon-preview">
      <style>{`
        .golden-seal-card {
          width: 280px;
          height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          color: #554525;
          background:
            radial-gradient(ellipse at 50% 23%, rgba(255,255,255,.62), transparent 51%),
            #f6f0df;
          font-family: "Palatino Linotype", "Book Antiqua", Georgia, serif;
        }
        .golden-seal-tile {
          width: 224px;
          height: 224px;
          border-radius: 49px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 43%, #fffdf1 0%, #fbf5df 49%, #f3e9c9 100%);
          box-shadow:
            0 18px 35px rgba(105, 79, 31, .13),
            0 2px 5px rgba(99, 76, 38, .09),
            inset 0 1px 0 rgba(255,255,255,.8);
        }
        .golden-seal-art {
          width: 100%;
          height: 100%;
          display: block;
        }
        .golden-seal-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          line-height: 1;
          letter-spacing: .015em;
          font-weight: 600;
          color: #48391f;
        }
        .golden-seal-rationale {
          margin: -8px 22px 0;
          max-width: 236px;
          color: #80704f;
          font: 11px/1.45 ui-sans-serif, system-ui, sans-serif;
          letter-spacing: .015em;
          text-align: center;
        }
      `}</style>
      <section className="golden-seal-card" aria-label="Golden Seal Flame app icon concept">
        <div className="golden-seal-tile">
          <svg
            className="golden-seal-art"
            viewBox="0 0 256 256"
            role="img"
            aria-label="Layered golden flame enclosed by a delicate circular seal"
          >
            <defs>
              <linearGradient id="seal-flame-main" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff18a" />
                <stop offset=".38" stopColor="#f7bd24" />
                <stop offset=".7" stopColor="#d98708" />
                <stop offset="1" stopColor="#8e4105" />
              </linearGradient>
              <linearGradient id="seal-flame-side" x1="0" y1="0" x2=".7" y2="1">
                <stop offset="0" stopColor="#ffe96e" />
                <stop offset=".52" stopColor="#efa80f" />
                <stop offset="1" stopColor="#a94d06" />
              </linearGradient>
              <linearGradient id="seal-flame-core" x1=".2" y1="0" x2=".8" y2="1">
                <stop offset="0" stopColor="#fffdf0" />
                <stop offset=".55" stopColor="#fff2a1" />
                <stop offset="1" stopColor="#f6ae16" />
              </linearGradient>
              <radialGradient id="seal-base-light" cx=".5" cy=".42" r=".58">
                <stop offset="0" stopColor="#fff6ca" stopOpacity=".5" />
                <stop offset="1" stopColor="#fff6ca" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="128" cy="128" r="102" fill="url(#seal-base-light)" />
            {/* A fine, quiet seal: intentionally open in tone rather than competing with the flame. */}
            <circle
              cx="128"
              cy="128"
              r="91"
              fill="none"
              stroke="#cba75c"
              strokeWidth="1.35"
              opacity=".72"
            />
            <circle
              cx="128"
              cy="128"
              r="86.5"
              fill="none"
              stroke="#e4d1a4"
              strokeWidth=".75"
              opacity=".8"
            />
            <path
              d="M73 163c-1-24 15-41 22-58 6 12 7 21 6 30 12-18 14-37 10-58 23 20 30 42 24 63 7-8 11-17 13-27 11 19 17 34 15 52-2 24-21 40-46 40-25 0-42-16-44-42Z"
              fill="url(#seal-flame-side)"
            />
            <path
              d="M91 181c-3-24 7-43 19-60 9-13 15-27 16-45 17 16 21 34 16 51 9-8 15-20 18-35 11 19 18 36 17 53-1 27-17 46-43 46-23 0-40-12-43-34Z"
              fill="url(#seal-flame-main)"
            />
            <path
              d="M111 184c-1-13 7-23 12-33 4-8 6-16 6-26 12 12 17 25 13 38 5-4 8-10 10-17 6 12 8 22 6 32-2 12-11 20-24 20-12 0-21-5-23-14Z"
              fill="url(#seal-flame-core)"
            />
            <path
              d="M124 199c5-8 5-14 4-20 8 7 11 15 9 22-1 5-5 8-9 8-5 0-8-3-8-7 0-2 1-3 4-3Z"
              fill="#9a4b09"
              opacity=".83"
            />
            <path
              d="M106 91c-3 25-12 39-23 57"
              fill="none"
              stroke="#fff5a9"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity=".55"
            />
            <path
              d="M140 89c-1 25 6 42 20 60"
              fill="none"
              stroke="#fff7bd"
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".48"
            />
          </svg>
        </div>
        <h1 className="golden-seal-title">Golden Seal Flame</h1>
        <p className="golden-seal-rationale">
          The familiar layered flame, held in a fine double-line seal for a quieter sense of finish.
        </p>
      </section>
    </main>
  );
}
