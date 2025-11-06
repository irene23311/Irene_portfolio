// src/components/MapLazy.jsx
import { lazy, Suspense, useEffect, useRef, useState } from "react";
const NodeMap = lazy(() => import("./NodeMap")); // your existing component

export default function MapLazy({ nodeMapProps }) {
  const ref = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting || e.intersectionRatio > 0) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Use relative positioning and full-size so the map stays inside its section
    <div ref={ref} 
    style={{ 
      position: "relative", 
      width: "100%", 
      height: "100vh" 
      }}>
      {shouldMount ? (
        <Suspense
          fallback={
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div style={{ opacity: 0.7, fontSize: 14 }}>Loading map…</div>
            </div>
          }
        >
          <NodeMap {...nodeMapProps} />
        </Suspense>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Preparing map…</div>
        </div>
      )}
    </div>
  );
}
