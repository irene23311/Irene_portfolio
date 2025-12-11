import { useParams, Link } from "react-router-dom";

const titles = {
  "data-viz": "Data Viz",
  animation: "Animation",
  paintings: "Paintings",
  "motion-graphics": "Motion Graphics",
  interactive: "Interactive",
  installations: "Installations",
};

export default function SectionPage() {
  const { slug = "" } = useParams();
  const title = titles[slug] || "Section";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: "3rem 1.5rem",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          padding: "2.5rem",
          borderRadius: 18,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          textAlign: "center",
          color: "var(--ink)",
        }}
      >
        <p style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: 12, margin: 0, opacity: 0.6 }}>
          Coming Soon
        </p>
        <h1 style={{ margin: "10px 0 14px", fontSize: 32 }}>{title}</h1>
        <p style={{ maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.6 }}>
          This section will showcase projects and details for <strong>{title}</strong>. Add your work here when
          you&rsquo;re ready.
        </p>
        <Link to="/" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
