import "./_group.css";

export function DeepEmberFlame() {
  return (
    <div className="sw-icon-preview">
      <div
        style={{
          width: "100%",
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 13,
          padding: "16px 12px 12px",
          background: "#f8f3e7",
          color: "#57351b",
          fontFamily: '"Georgia", "Times New Roman", serif',
        }}
      >
        <div
          style={{
            width: 218,
            height: 218,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 45,
            background: "linear-gradient(145deg, #fff9df 0%, #f7ebc4 100%)",
            boxShadow:
              "0 12px 28px rgba(111, 73, 22, 0.13), inset 0 1px 0 rgba(255,255,255,.82), inset 0 -2px 7px rgba(184,132,45,.08)",
          }}
        >
          <svg
            viewBox="0 0 256 256"
            role="img"
            aria-label="A layered golden flame with a bright inner core"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient id="ember-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f8d65a" />
                <stop offset=".35" stopColor="#e9a51d" />
                <stop offset=".69" stopColor="#b9680e" />
                <stop offset="1" stopColor="#783b13" />
              </linearGradient>
              <linearGradient id="ember-left" x1=".15" y1="0" x2=".8" y2="1">
                <stop offset="0" stopColor="#f4cc4b" />
                <stop offset=".48" stopColor="#d88711" />
                <stop offset="1" stopColor="#8d4710" />
              </linearGradient>
              <linearGradient id="ember-right" x1=".2" y1="0" x2=".8" y2="1">
                <stop offset="0" stopColor="#f8dc72" />
                <stop offset=".45" stopColor="#e6a321" />
                <stop offset="1" stopColor="#a65310" />
              </linearGradient>
              <linearGradient id="ember-core" x1=".5" y1="0" x2=".5" y2="1">
                <stop offset="0" stopColor="#fffdf0" />
                <stop offset=".56" stopColor="#fff3b9" />
                <stop offset="1" stopColor="#f6bf36" />
              </linearGradient>
              <linearGradient id="ember-highlight" x1="0" y1="0" x2="1" y2=".4">
                <stop offset="0" stopColor="#fff7c8" stopOpacity=".9" />
                <stop offset="1" stopColor="#fff7c8" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="ember-ground" cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#bd7018" stopOpacity=".22" />
                <stop offset="1" stopColor="#bd7018" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="128" cy="209" rx="57" ry="12" fill="url(#ember-ground)" />
            <path
              d="M127 207C99 202 77 185 76 158c-1-21 13-39 19-59 8 13 11 25 9 37 14-21 14-48 9-75 24 22 37 49 33 74 9-14 14-29 14-45 21 25 31 49 28 73-3 25-24 40-61 44Z"
              fill="url(#ember-body)"
            />
            <path
              d="M100 194c-15-9-23-22-20-38 2-11 9-22 14-35 6 11 7 23 3 34 11-12 17-26 17-44 11 18 13 37 5 53-4 10-10 20-19 30Z"
              fill="url(#ember-left)"
            />
            <path
              d="M158 193c16-11 25-25 22-42-1-11-7-22-10-34-8 10-11 22-8 34-10-11-14-25-13-42-13 17-17 35-11 53 4 12 10 22 20 31Z"
              fill="url(#ember-right)"
            />
            <path
              d="M128 192c-15-11-22-23-20-38 2-16 13-30 15-50 17 17 31 35 31 54 0 15-9 27-26 34Z"
              fill="url(#ember-core)"
            />
            <path
              d="M128 190c-8-8-12-17-10-27 2-9 7-17 10-27 10 13 16 24 15 34-1 9-6 16-15 20Z"
              fill="#fffdf1"
              opacity=".74"
            />
            <path
              d="M104 177c-9-14-10-27-4-40"
              fill="none"
              stroke="url(#ember-highlight)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M128 205c-3-7-3-14 1-20 5 6 7 13 5 20"
              fill="none"
              stroke="#673312"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ textAlign: "center", lineHeight: 1.2 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: ".01em",
              color: "#5e3a1d",
            }}
          >
            Deep Ember Flame
          </div>
          <div
            style={{
              marginTop: 5,
              fontFamily: "system-ui, sans-serif",
              fontSize: 10.5,
              letterSpacing: ".01em",
              color: "#927957",
            }}
          >
            A brighter core rises from a richer amber base.
          </div>
        </div>
      </div>
    </div>
  );
}
