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

