import "./_group.css";

export function CurrentFlame() {
  return (
    <div
      className="sw-icon-preview"
      style={{
        minHeight: 350,
        padding: 24,
        background: "linear-gradient(145deg, #f4efe2 0%, #ebe2d1 100%)",
        color: "#473321",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 194,
            height: 194,
            margin: "0 auto 18px",
            borderRadius: 42,
            overflow: "hidden",
            boxShadow: "0 18px 36px rgba(90, 62, 26, 0.18)",
          }}
        >
          <img
            src="/__mockup/images/sacred-words-current-icon.png"
            alt="Current Sacred Words icon: a glowing golden flame on a cream background"
            style={{ display: "block", width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Current Flame
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: "system-ui, sans-serif",
            fontSize: 11,
            color: "#806b52",
          }}
        >
          The existing icon, unchanged
        </div>
      </div>
    </div>
  );
}
