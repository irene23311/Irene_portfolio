// src/components/IntroSection.jsx
export default function IntroSection({ onEnter }) {
  return (
    <div className="introWrap">
      <h1 style={{ fontSize: "48px", lineHeight: 1.1, marginBottom: 16 }}>
        Irene — Interactive Media Artist
      </h1>
      <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 24 }}>
        Short intro about your practice + what visitors will find.
        Scroll or click to enter the interactive map.
      </p>
      <button
        onClick={onEnter}
        style={{
          padding: "12px 20px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.4)",
          background: "transparent",
          color: "inherit",
          cursor: "pointer"
        }}
      >
        Explore the Map
      </button>
      <div style={{ marginTop: 12 }}>
        <a href="/#map" style={{ textDecoration: "underline", opacity: 0.75 }}>
          Skip to map
        </a>
      </div>
    </div>
  );
}
