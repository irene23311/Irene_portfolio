/* eslint-disable react/prop-types */
const AREAS = [
  { id: "Data Viz", label: "Data Viz", cx: 210, cy: 95, r: 30, tx: 210, ty: 88 },
  { id: "Animation", label: "Animation", cx: 110, cy: 80, r: 26, tx: 110, ty: 73 },
  { id: "Paintings", label: "Paintings", cx: 235, cy: 165, r: 28, tx: 235, ty: 158 },
  { id: "Motion Graphics", label: "Motion Graphics", cx: 130, cy: 185, r: 26, tx: 130, ty: 178 },
  { id: "Interactive", label: "Interactive", cx: 75, cy: 145, r: 24, tx: 75, ty: 138 },
  { id: "Installations", label: "Installations", cx: 165, cy: 135, r: 24, tx: 165, ty: 128 },
];

const stroke = "#0f0f0f";

export default function MoonMap({ onAreaSelect, activeIds = [] }) {
  const handleKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAreaSelect?.(id);
    }
  };

  return (
    <div className="moon-wrap">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Moon map with clickable craters"
        className="moon-svg"
      >
        <defs>
          <radialGradient id="moonSoft" cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="70%" stopColor="#f4f1e9" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#ddd8ce" stopOpacity="0.75" />
          </radialGradient>
        </defs>

        {/* outer form */}
        <circle
          cx="160"
          cy="160"
          r="128"
          fill="url(#moonSoft)"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* loose ink lines inspired by reference */}
        <path
          d="M63 121c9-18 29-29 44-33m154 21c-6 17-17 30-32 37M83 219c14 10 35 14 50 13m38-154c-8 2-18 7-22 13"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />
        <path
          d="M201 188c14-17 22-45 7-63m-71 89c-9 8-21 14-33 15m120-142c6-4 10-10 12-18"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.7"
        />
        <path
          d="M188 89c8 6 19 8 29 7m-132 41c-10 10-14 27-12 40m138 35c10-2 21-7 28-15"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.65"
        />

        {/* small crater strokes */}
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.8">
          <path d="M214 112c6-9 20-11 24-1" />
          <path d="M214 112c-3 9 6 17 13 12" />
          <path d="M110 108c9-7 17-9 23-2" />
          <path d="M112 211c7-6 12-13 22-10" />
          <path d="M68 162c5-4 9-9 15-10" />
          <path d="M178 234c-7-2-13-5-18-10" />
        </g>

        {/* crater shapes for click targets */}
        {AREAS.map((area) => {
          const isActive = activeIds.includes(area.id);
          return (
            <g
              key={area.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${area.label}`}
              onClick={() => onAreaSelect?.(area.id)}
              onKeyDown={(e) => handleKey(e, area.id)}
              className="moon-area"
            >
              <circle
                cx={area.cx}
                cy={area.cy}
                r={area.r}
                fill={isActive ? "rgba(255, 193, 193, 0.45)" : "rgba(0,0,0,0.06)"}
                stroke={stroke}
                strokeOpacity={isActive ? 0.8 : 0.35}
                strokeWidth="1.4"
              />
              <text
                x={area.tx}
                y={area.ty}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fill={isActive ? "#9b1b1b" : "#151515"}
                style={{ pointerEvents: "none" }}
              >
                {area.label}
              </text>
              <circle
                cx={area.cx}
                cy={area.cy}
                r={area.r + 10}
                fill="transparent"
                stroke="transparent"
              />
            </g>
          );
        })}
      </svg>
      <p className="moon-hint">Click a crater to toggle a tag.</p>
    </div>
  );
}
