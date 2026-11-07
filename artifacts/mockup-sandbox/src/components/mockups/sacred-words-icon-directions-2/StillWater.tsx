export function StillWater() {
  return (
    <main className="still-water-stage">
      <style>{`
        .still-water-stage {
          box-sizing: border-box;
          width: 280px;
          height: 350px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          background: #e9e6da;
          color: #253b3b;
          font-family: "Avenir Next", "Segoe UI", sans-serif;
        }
        .still-water-card {
          position: relative;
          box-sizing: border-box;
          width: 256px;
          height: 326px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(49, 69, 65, .08);
          border-radius: 19px;
          background: #f4f1e7;
          box-shadow: 0 12px 28px rgba(50, 66, 59, .10), 0 2px 4px rgba(50, 66, 59, .06);
          animation: water-arrive 620ms cubic-bezier(.2,.7,.25,1) both;
        }
        .still-water-kicker {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7d8175;
          font-size: 8px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: .15em;
        }
        .still-water-kicker::before {
          content: "";
          width: 14px;
          height: 1px;
          background: #c5965d;
        }
        .still-water-icon {
          width: 210px;
          height: 210px;
          margin-top: 12px;
          flex: 0 0 auto;
          border-radius: 46px;
          overflow: hidden;
          box-shadow: 0 12px 20px rgba(31, 54, 54, .19), 0 2px 3px rgba(31, 54, 54, .1);
          animation: water-settle 720ms 100ms cubic-bezier(.2,.7,.25,1) both;
        }
        .still-water-copy {
          width: 100%;
          margin-top: 9px;
        }
        .still-water-copy h1 {
          margin: 0;
          color: #263d3c;
          font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
          font-size: 21px;
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .still-water-copy p {
          margin: 4px 0 0;
          max-width: 225px;
          color: #68746d;
          font-size: 10px;
          line-height: 1.28;
          letter-spacing: .005em;
        }
        .still-water-index {
          position: absolute;
          top: 12px;
          right: 13px;
          color: #a7a594;
          font: 600 7px/1 "Avenir Next", "Segoe UI", sans-serif;
          letter-spacing: .1em;
        }
        @keyframes water-arrive {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes water-settle {
          from { opacity: 0; transform: scale(.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .still-water-card, .still-water-icon { animation: none; }
        }
      `}</style>
      <section className="still-water-card" aria-label="Still Water app icon concept">
        <div className="still-water-kicker">SACRED WORDS · ICON STUDY</div>
        <div className="still-water-index">05</div>
        <div className="still-water-icon" role="img" aria-label="Offset water contours surrounding a quiet center">
          <svg viewBox="0 0 200 200" width="210" height="210" aria-hidden="true">
            <rect width="200" height="200" rx="43" fill="#294344" />
            <path
              d="M143 48C170 56 188 78 190 103C193 130 178 151 155 164C133 177 104 177 80 165C57 153 44 132 46 108C48 83 65 63 89 53"
              fill="none"
              stroke="#d6c59e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M129 72C150 77 163 91 164 108C165 126 154 140 137 148C120 157 99 155 83 146C68 137 59 123 61 106C62 90 73 78 91 72"
              fill="none"
              stroke="#e6d8b8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M116 91C128 94 136 102 136 112C136 122 129 130 119 135C108 140 95 137 87 131C79 125 76 116 78 107C80 98 87 93 97 91"
              fill="none"
              stroke="#f1e7cd"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M105 105C110 107 113 111 112 116C111 121 107 124 102 124C97 124 94 120 94 116C94 111 98 107 105 105Z" fill="#d2a86b" />
            <path d="M48 47C53 42 59 39 66 37" fill="none" stroke="#d2a86b" strokeWidth="2" strokeLinecap="round" opacity=".72" />
          </svg>
        </div>
        <div className="still-water-copy">
          <h1>Still Water</h1>
          <p>Offset ripples gather around one quiet center—a small sign of words settling into reflection.</p>
        </div>
      </section>
    </main>
  );
}
