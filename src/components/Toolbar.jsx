
export default function Toolbar({ selectedTags = [], onToggleTag, onAddProject }) {
  const tags = [
    "Data Viz",
    "React",
    "Animation",
    "Paintings",
    "Motion Graphics",
    "Front-end",
    "AR",
    "Museums",
    "Interactive",
    "Installations",
  ];

  return (
    <div
      className="toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        background: "var(--panel)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
      }}
    >
      {/* 🔍 Search icon (visual only for now */}
      <div
        style={{
          width: "40px",
          height: "40px",
          display: "grid",
          placeItems: "center",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "#ffffffff",
          color: "var(--muted)",
          fontSize: "18px",
        }}
        aria-label="Search"
        title="Search"
      >
        🔍
      </div>
        {/* 🏷️ Toggle chips */}
      {tags.map((tag) => {
        const isActive = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            className={`chip ${isActive ? "is-active" : ""}`}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "#ffffffff",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        );
      })}

      {/* ➕ Add Project (optional) */}
      <button
        type="button"
        className="btn primary"
        style={{ marginLeft: "auto" }}
        onClick={onAddProject}
      >
        + 
      </button>
    </div>
  );
}
