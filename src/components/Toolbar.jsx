
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
    <div className="toolbar">
      {/* 🔍 Search icon (visual only for now */}
      <div
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
