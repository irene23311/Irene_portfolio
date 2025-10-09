/* eslint-disable react/prop-types */
import React from 'react';


/**
* NodeMap - zoomable & pannable 2D canvas of project nodes
* Props expected (all controlled by parent):
*  - projects: [{id, title, x, y, category, ...}]
*  - zoomLevel, setZoomLevel
*  - panOffset: {x, y} in pixels (screen translation AFTER scaling)
*  - setPanOffset
*  - onProjectSelect(project)
*
* Implementation notes:
*  We maintain a large 'world' (logical coordinate system). We scale the world with CSS transform: translate(px, py) scale(s).
*  This is more performant and simpler than recalculating each node's position every render.
*/
function NodeMap({
 projects,
 onProjectSelect,
 zoomLevel,
 setZoomLevel,
 panOffset,
 setPanOffset,
 // optional advanced customization
 worldWidth = 2000,
 worldHeight = 1400,
 minZoom = 0.4,
 maxZoom = 4
}) {
 const viewportRef = React.useRef(null);
 const isDraggingRef = React.useRef(false);
 const dragStartRef = React.useRef({ x: 0, y: 0 }); // mouse pos at drag start
 const panStartRef = React.useRef({ x: 0, y: 0 }); // pan offset at drag start


 // Utility: clamp zoom
 const clampZoom = (z) => Math.min(maxZoom, Math.max(minZoom, z));


 // Cursor‑centred wheel zoom.
 const handleWheel = (e) => {
   e.preventDefault();
   const { clientX, clientY, deltaY } = e;
   const zoomStep = 0.05; // 5% per wheel tick
  const factor = deltaY > 0 ? 1 - zoomStep : 1 + zoomStep; // wheel down -> zoom out, up -> zoom in (by 0.9 (out) or 1.1 (in).)
   const newZoom = clampZoom(zoomLevel * factor);
   if (newZoom === zoomLevel) return; // hit min/max, nothing to do


   // Get cursor position relative to viewport top-left
   const rect = viewportRef.current.getBoundingClientRect();
   const cursorX = clientX - rect.left;
   const cursorY = clientY - rect.top;


   // World coordinates of cursor before zoom
   const worldXBefore = (cursorX - panOffset.x) / zoomLevel;
   const worldYBefore = (cursorY - panOffset.y) / zoomLevel;


   // After zoom, compute new pan so the same world point stays under cursor.
   const newPanX = cursorX - worldXBefore * newZoom;
   const newPanY = cursorY - worldYBefore * newZoom;


   setZoomLevel(newZoom);
   setPanOffset({ x: newPanX, y: newPanY });
 };


 const handleMouseDown = (e) => {
   // Ignore drags that start on interactive node elements (allow click)
   if (e.target.closest('.node')) return;
   isDraggingRef.current = true;
   dragStartRef.current = { x: e.clientX, y: e.clientY };
   panStartRef.current = { ...panOffset };
 };


 const handleMouseMove = (e) => {
   if (!isDraggingRef.current) return;
   const dx = e.clientX - dragStartRef.current.x;
   const dy = e.clientY - dragStartRef.current.y;
   setPanOffset({ x: panStartRef.current.x + dx, y: panStartRef.current.y + dy });
 };


 const endDrag = () => {
   isDraggingRef.current = false;
 };


 // Optional: double click to focus/zoom in a little
 const handleDoubleClick = (e) => {
   const rect = viewportRef.current.getBoundingClientRect();
   const cursorX = e.clientX - rect.left;
   const cursorY = e.clientY - rect.top;
   const targetZoom = clampZoom(zoomLevel * 1.35);
   const worldXBefore = (cursorX - panOffset.x) / zoomLevel;
   const worldYBefore = (cursorY - panOffset.y) / zoomLevel;
   setZoomLevel(targetZoom);
   setPanOffset({ x: cursorX - worldXBefore * targetZoom, y: cursorY - worldYBefore * targetZoom });
 };


 // Keep nodes absolutely positioned in world coordinates (x,y) *without* mixing zoom math repeatedly.
 // We just render them inside the scaled world container.
 const worldStyle = {
   position: 'absolute',
   left: 0,
   top: 0,
   width: worldWidth,
   height: worldHeight,
   transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
   transformOrigin: '0 0',
 };


 const nodeBaseSize = 30; // px at zoom = 1 inside world space, change node size here


 return (
   <div
     ref={viewportRef}
     className="absolute inset-0 overflow-hidden select-none bg-[radial-gradient(circle_at_50%_50%,#f8fafc,#e2e8f0)]"
     onWheel={handleWheel}
     onMouseDown={handleMouseDown}
     onMouseMove={handleMouseMove}
     onMouseUp={endDrag}
     onMouseLeave={endDrag}
     onDoubleClick={handleDoubleClick}
     role="application"
     aria-label="Project map"
   >
     <div style={worldStyle}>
       {/* Optional grid */}
       <div
         aria-hidden
         style={{
           position: 'absolute',
           inset: 0,
           backgroundImage:
             'linear-gradient(#cbd5e133 1px, transparent 1px), linear-gradient(90deg,#cbd5e133 1px, transparent 1px)',
           backgroundSize: '80px 80px',
           pointerEvents: 'none'
         }}
       />
        {projects.map((p) => (
          //node ui start here
          <div
            key={p.id}
            className="node group"
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: nodeBaseSize * 1.5, // width of node
              height: nodeBaseSize * 1.5,// height of node
              transform: 'translate(-50%,-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={p.title}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onProjectSelect(p);
            }}
            onKeyDown={(e) => e.key === 'Enter' && onProjectSelect(p)}
            aria-label={`Project ${p.title}`}
          >
            {/* node UI starts here */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 180 48"
              preserveAspectRatio="none"
              role="img"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D7C5F5" />
                <stop offset="100%" stopColor="#A8C8F6" />
                </linearGradient>

                <linearGradient id={`gloss-${p.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
//not showing anything on the screen
                <filter id={`shadow-${p.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000ff" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* main pill (back layer) */}
              <rect x="8" y="6" rx="64" ry="64" width="148" height="36" fill="#f6d8a8" />

              {/* shadowed gradient top layer */}
              <rect x="6" y="4" rx="64" ry="64" width="148" height="36" fill={`url(#grad-${p.id})`} filter={`url(#shadow-${p.id})`} />

              {/* subtle gloss */}
              <rect x="6" y="4" rx="64" ry="64" width="148" height="18" fill={`url(#gloss-${p.id})`} opacity="0.7" />

              {/* text */}
              <text x="80" y="30" textAnchor="middle" fill="#0b0b0b" fontWeight="800" fontSize="16" style={{ fontFamily: 'DM Sans, system-ui, -apple-system, Segoe UI, Roboto' }}>
                {"N"}
              </text>
            </svg>

            {/* tooltip / label (preserve current behavior) */}
            <div
              className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(68, 99, 165, 0.9)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
                whiteSpace: 'nowrap'
              }}
            >
              {p.title}
            </div>
          </div>
        ))}
     </div>
     {/* HUD overlay */}
     <div className="absolute left-3 top-3 px-3 py-2 rounded bg-white/80 shadow backdrop-blur text-xs space-x-3 font-mono flex">
       <span>zoom: {zoomLevel.toFixed(2)}</span>
       <span>pan: [{Math.round(panOffset.x)}, {Math.round(panOffset.y)}]</span>
       <span>nodes: {projects.length}</span>
     </div>
   </div>
 );
}


export default NodeMap;

