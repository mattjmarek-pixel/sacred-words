import "./_group.css";

export function SoftHaloFlame() {
  return (
    <div className="sw-icon-preview">
      <div
        style={{
          width: 280,
          height: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          color: "#534631",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          aria-label="Cream app icon with a golden flame and a subtle soft halo"
          role="img"
          style={{
            width: 244,
            height: 244,
            borderRadius: 55,
            overflow: "hidden",
            background: "linear-gradient(145deg, #fff9e8 0%, #f7edcf 100%)",
            boxShadow:
              "0 15px 32px rgba(107, 79, 30, .13), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -2px 7px rgba(170,130,58,.08)",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 300 300" width="100%" height="100%" aria-hidden="true">
            <defs>
              <radialGradient id="halo" cx="50%" cy="55%" r="50%">
                <stop offset="0%" stopColor="#f2ca62" stopOpacity=".30" />
                <stop offset="46%" stopColor="#f5d982" stopOpacity=".18" />
                <stop offset="100%" stopColor="#f5d982" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="outerFlame" x1="25%" y1="6%" x2="73%" y2="96%">
                <stop offset="0%" stopColor="#f5d86b" />
                <stop offset="34%" stopColor="#eebf43" />
                <stop offset="72%" stopColor="#d99727" />
                <stop offset="100%" stopColor="#b96d1d" />
              </linearGradient>
              <linearGradient id="innerFlame" x1="50%" y1="16%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fff4c3" />
                <stop offset="54%" stopColor="#ffe58a" />
                <stop offset="100%" stopColor="#efb53c" />
              </linearGradient>
              <filter id="softEdge" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.1" />
              </filter>
            </defs>
            <rect width="300" height="300" fill="url(#halo)" />
            <ellipse cx="150" cy="225" rx="61" ry="9" fill="#c99b46" opacity=".08" />
            <path
              d="M150 70 C145 100 125 119 119 147 C114 172 124 187 107 204 C95 216 88 231 95 245 C104 263 125 270 150 270 C177 270 199 260 206 242 C214 224 201 209 191 196 C179 180 185 158 178 137 C171 116 156 99 150 70Z"
              fill="#c88725"
              opacity=".14"
              filter="url(#softEdge)"
            />
            <path
              d="M151 66 C143 96 124 116 119 145 C114 171 124 187 107 204 C95 217 89 232 96 246 C104 263 125 271 150 271 C176 271 197 262 205 245 C213 228 204 213 193 198 C181 182 184 161 179 141 C173 117 158 96 151 66Z"
              fill="url(#outerFlame)"
            />
            <path
              d="M150 92 C151 125 168 144 168 168 C168 190 157 205 164 223 C169 237 181 243 180 252 C179 263 166 269 150 269 C136 269 122 263 120 253 C118 242 132 233 137 220 C145 200 130 182 133 162 C136 139 148 119 150 92Z"
              fill="url(#innerFlame)"
            />
            <path
              d="M151 100 C149 130 139 148 139 166"
              fill="none"
              stroke="#fff4c8"
              strokeWidth="3"
              strokeLinecap="round"
              opacity=".65"
            />
            <path
              d="M150 246 C147 252 148 259 151 266"
              fill="none"
              stroke="#9d571b"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity=".55"
            />
          </svg>
        </div>
        <div style={{ textAlign: "center", lineHeight: 1.2 }}>
          <div style={{ fontSize: 17, letterSpacing: ".01em", fontWeight: 600 }}>
            Soft Halo Flame
          </div>
          <div
            style={{
              marginTop: 5,
              maxWidth: 248,
              color: "#887858",
              fontSize: 11,
              lineHeight: 1.35,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            A quiet amber haze gives the familiar flame gentle separation.
          </div>
        </div>
      </div>
    </div>
  );
}
