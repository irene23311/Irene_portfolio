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
 // Background image that should zoom/pan with the world
 backgroundImageUrl,
 backgroundOpacity = 1,
 backgroundSize = 'cover',
 backgroundRepeat = 'no-repeat',
 backgroundPosition = 'center',
 // Connections between nodes: array of {from: nodeId, to: nodeId}
 connections = [],
 lineColor = [],
 lineWidth = 2,
 lineOpacity = 0.6,
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
   const factor = deltaY > 0 ? 0.9 : 1.1;
   const newZoom = clampZoom(zoomLevel * factor);
   if (newZoom === zoomLevel) return; // no change


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


 const nodeBaseSize = 20; // px at zoom = 1 inside world space

 // Build a lookup map for quick node access by id
 const nodeMap = React.useMemo(() => {
   const map = {};
   projects.forEach(p => {
     map[p.id] = p;
   });
   return map;
 }, [projects]);


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
        {/* Background image that participates in the same world transform */}
        {backgroundImageUrl && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: backgroundSize,
              backgroundRepeat: backgroundRepeat,
              backgroundPosition: backgroundPosition,
              opacity: backgroundOpacity,
              zIndex: 0,
            }}
          />
        )}
       {/* Optional grid */}
       <div
         aria-hidden
       />

       {/* SVG layer for connection lines */}
       {connections.length > 0 && (
         <svg
           style={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: worldWidth,
             height: worldHeight,
             pointerEvents: 'none',
             zIndex: 0,
           }}
           aria-hidden
         >
           {connections.map((conn, idx) => {
             const fromNode = nodeMap[conn.from];
             const toNode = nodeMap[conn.to];
             if (!fromNode || !toNode) return null;
             // Calculate center of each node
             const x1 = fromNode.x + nodeBaseSize / 2;
             const y1 = fromNode.y + nodeBaseSize / 2;
             const x2 = toNode.x + nodeBaseSize / 2;
             const y2 = toNode.y + nodeBaseSize / 2;
             
             // Calculate control point for quadratic bezier curve
             // Place it perpendicular to the midpoint for a smooth arc
             const midX = (x1 + x2) / 2;
             const midY = (y1 + y2) / 2;
             const dx = x2 - x1;
             const dy = y2 - y1;
             const distance = Math.sqrt(dx * dx + dy * dy);
             // Curve intensity: 10% of distance
             const curvature = distance * 0.1;
             // Perpendicular offset
             const controlX = midX + (dy / distance) * curvature;
             const controlY = midY - (dx / distance) * curvature;

             // Create SVG path with quadratic bezier curve: M start, Q control end
             const pathData = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
             
             return (
               <path
                 key={`${conn.from}-${conn.to}-${idx}`}
                 d={pathData}
                 stroke={lineColor}
                 strokeWidth={lineWidth}
                 strokeOpacity={lineOpacity}
                 fill="none"
               />
             );
           })}
         </svg>
       )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {projects.map((p) => (
            <div
              key={p.id}
              className="node group"
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: nodeBaseSize,
                height: nodeBaseSize,
                borderRadius: '50%',
                background: 'var(--primary-color, #E7F5de)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
                fontSize: 10,
                cursor: 'pointer',
                boxShadow: '0 0 4px rgba(0,0,0,0.25)'
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
              <span style={{ fontWeight: 600 }}>{p.title[0]}</span>
              {/* Tooltip / label */}
              <div
                className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(17,24,39,0.9)',
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

