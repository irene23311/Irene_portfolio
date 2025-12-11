import React from "react";

const CRATERS = [
  { id: "Data Viz", slug: "data-viz", label: "Data Viz", cx: 220, cy: 230, r: 18 },
  { id: "Animation", slug: "animation", label: "Animation", cx: 320, cy: 260, r: 20 },
  { id: "Paintings", slug: "paintings", label: "Paintings", cx: 280, cy: 340, r: 18 },
  { id: "Motion Graphics", slug: "motion-graphics", label: "Motion Graphics", cx: 200, cy: 360, r: 17 },
  { id: "Interactive", slug: "interactive", label: "Interactive", cx: 180, cy: 280, r: 15 },
  { id: "Installations", slug: "installations", label: "Installations", cx: 240, cy: 180, r: 14 },
];

const stroke = "#0f0f0f";

export default function InteractiveMoon({ onAreaSelect, onOpenPage, activeIds = [] }) {
  const handleClick = (crater) => onAreaSelect?.(crater.id);
  const handleKey = (e, crater) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(crater);
    }
  };

  return (
    <div className="moon-wrap">
      <svg viewBox="0 0 500 600" className="moon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="moonGradient" cx="40%" cy="40%" r="60%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#ecfccb" />
            <stop offset="40%" stopColor="#9df9e5ff" />
            <stop offset="100%" stopColor="#6480f2ff" />
          </radialGradient>
          <linearGradient id="starTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <linearGradient id="starPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="starYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="starPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="starOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>
          <linearGradient id="starRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="starGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#bef264" />
          </linearGradient>
          <linearGradient id="craterShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8d35e6ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#166eccff" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* back particles */}
        <g id="particles-back" opacity="0.8" transform="scale(1.25) translate(-50 -60)">
          <circle className="star" cx="150" cy="150" r="1.8" fill="url(#starTeal)" />
          <circle className="star" cx="380" cy="180" r="1.1" fill="url(#starPink)" />
          <circle className="star" cx="400" cy="400" r="2.2" fill="url(#starYellow)" />
          <path d="M100 200 L103 208 L110 210 L103 212 L100 220 L97 212 L90 210 L97 208 Z" fill="url(#starPurple)" transform="scale(0.8) translate(22 40)" />
          <circle className="star" cx="120" cy="450" r="1.1" fill="url(#starTeal)" />
        </g>

        {/* moon */}
        <g filter="url(#glow)">
          <circle cx="250" cy="300" r="130" fill="url(#moonGradient)" />
          <path
            d="M 250 175 A 125 125 0 0 0 170 380"
            fill="none"
            stroke="#f7fee7"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <g fill="#a3e635" opacity="0.7">
            <ellipse cx="200" cy="240" rx="25" ry="18" transform="rotate(-30 200 240)" fill="url(#craterShadow)" />
            <path d="M 190 230 A 20 15 0 0 0 210 250" fill="none" stroke="#d9f99d" strokeWidth="2" />
            <ellipse cx="320" cy="360" rx="30" ry="22" transform="rotate(-10 320 360)" fill="url(#craterShadow)" />
            <path d="M 310 350 A 25 18 0 0 0 330 375" fill="none" stroke="#d9f99d" strokeWidth="2" />
            <ellipse cx="200" cy="380" rx="20" ry="12" fill="url(#craterShadow)" />
            <path d="M 280 220 Q 300 230 290 250 Q 260 260 270 230 Z" fill="#bef264" opacity="0.5" />
            <path d="M 230 300 Q 250 310 240 330 Z" fill="#bef264" opacity="0.5" />
          </g>
        </g>

        {/* clickable craters */}
        {CRATERS.map((crater) => {
          const isActive = activeIds.includes(crater.id);
          return (
            <g
              key={crater.id}
              onClick={() => {
                handleClick(crater);
                onOpenPage?.(crater.slug);
              }}
              onKeyDown={(e) => handleKey(e, crater)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${crater.label}`}
              className="moon-area"
            >
              {(() => {
                const craterFill = isActive ? "rgba(73, 178, 242, 0.35)" : "rgba(0,0,0,0.08)";
                const labelColor = isActive ? "#0f172a" : "#0f172a";
                return (
                  <>
                  <circle
                    className="moon-crater"
                    cx={crater.cx}
                    cy={crater.cy}
                    r={crater.r}
                    fill={craterFill}
                    stroke={stroke}
                    strokeOpacity={isActive ? 0.85 : 0.4}
                    strokeWidth="1.6"
                  />
                  <text
                    className="moon-label"
                    x={crater.cx}
                    y={crater.cy}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="monospace"
                    fill={labelColor}
                    dy="4"
                    style={{ pointerEvents: "none" }}
                  >
                    {crater.label}
                  </text>
                  </>
                );
              })()}
              <circle cx={crater.cx} cy={crater.cy} r={crater.r + 12} fill="transparent" stroke="transparent" />
            </g>
          );
        })}

        {/* front particles */}
        <g id="particles-front" transform="scale(1.2) translate(-40 -40)">
          <path className="star-path" d="M 80 250 L 90 280 L 120 290 L 90 300 L 80 330 L 70 300 L 40 290 L 70 280 Z" fill="url(#starPink)" transform="scale(0.48) translate(122, 140)" style={{ cursor: "pointer" }} />
          <path className="star-path" d="M 120 120 L 130 150 L 160 160 L 130 170 L 120 200 L 110 170 L 80 160 L 110 150 Z" fill="url(#starTeal)" transform="scale(0.64) translate(72, 30)" style={{ cursor: "pointer" }} />
          <path className="star-path" d="M 400 300 L 405 320 L 425 325 L 405 330 L 400 350 L 395 330 L 375 325 L 395 320 Z" fill="url(#starPurple)" transform="scale(0.8) translate(80, 60)" style={{ cursor: "pointer" }} />
          <path className="star-path" d="M 400 400 L 405 415 L 420 420 L 405 425 L 400 440 L 395 425 L 380 420 L 395 415 Z" fill="url(#starYellow)" transform="scale(0.78) translate(88, 90)" style={{ cursor: "pointer" }} />
          <path className="star-path" d="M 250 450 L 255 470 L 275 475 L 255 480 L 250 500 L 245 480 L 225 475 L 245 470 Z" fill="url(#starTeal)" transform="scale(0.62) translate(120, 150)" style={{ cursor: "pointer" }} />
          <path className="star-path" d="M 130 450 L 135 465 L 150 470 L 135 475 L 130 490 L 125 475 L 110 470 L 125 465 Z" fill="url(#starPurple)" transform="scale(0.7) translate(40, 120)" style={{ cursor: "pointer" }} />
          <circle className="star" cx="50" cy="200" r="1.2" fill="url(#starTeal)" />
          <circle className="star" cx="450" cy="250" r="1.6" fill="url(#starTeal)" />
          <circle className="star" cx="200" cy="500" r="1.2" fill="url(#starTeal)" />
          <circle className="star" cx="100" cy="150" r="1.6" fill="url(#starTeal)" />
          <circle className="star" cx="350" cy="100" r="1.2" fill="url(#starTeal)" />
          <circle className="star" cx="80" cy="350" r="1.6" fill="url(#starPink)" />
          <circle className="star" cx="420" cy="150" r="1.2" fill="url(#starPink)" />
          <circle className="star" cx="300" cy="80" r="1.6" fill="url(#starPink)" />
          <circle className="star" cx="360" cy="480" r="1.2" fill="url(#starRed)" />
          <circle className="star" cx="60" cy="400" r="1.2" fill="url(#starYellow)" />
          <circle className="star" cx="400" cy="200" r="1.2" fill="url(#starOrange)" />
          <circle className="star" cx="480" cy="350" r="1.6" fill="url(#starYellow)" />
          <circle className="star" cx="280" cy="550" r="1.2" fill="url(#starOrange)" />
          <circle className="star" cx="20" cy="300" r="1.2" fill="url(#starGreen)" />
          <circle className="star" cx="450" cy="400" r="1.2" fill="url(#starGreen)" />
          <circle className="star" cx="90" cy="100" r="1.2" fill="url(#starPurple)" />
          <circle className="star" cx="470" cy="300" r="1.6" fill="url(#starPurple)" />
        </g>
      </svg>
      <p className="moon-hint">Click a crater to toggle a tag.</p>
    </div>
  );
}
