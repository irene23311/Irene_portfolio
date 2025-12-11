import React, { useEffect, useRef } from "react";
import "./Ribbons.css";

/**
 * Canvas-based ribbon trail that follows pointer movement.
 * Softer/shorter by default; responds quickly to pointer movement.
 */
export default function Ribbons({
  children,
  className = "",
  style = {},
  colors = ["#7c3aed", "#a855f7", "#c084fc", "#e879f9"],
  baseSpring = 0.08,
  baseFriction = 0.85,
  baseThickness = 18,
  offsetFactor = 0.04,
  maxAge = 320,
  pointCount = 35,
  speedMultiplier = 0.85,
  enableFade = true,
  enableShaderEffect = false, // kept for API parity
  clipOverflow = false,
  ...rest
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    let rafId;
    const pointerVel = { x: 0, y: 0 };
    let lastPoint = null;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();

      if (lastPoint) {
        pointerVel.x = (x - lastPoint.x) * baseSpring * speedMultiplier + pointerVel.x * baseFriction;
        pointerVel.y = (y - lastPoint.y) * baseSpring * speedMultiplier + pointerVel.y * baseFriction;
      }

      lastPoint = { x, y };
      pointsRef.current.unshift({ x, y, t: now, vx: pointerVel.x, vy: pointerVel.y });
      pointsRef.current = pointsRef.current.slice(0, pointCount);
    };

    const handleLeave = () => {
      lastPoint = null;
      pointsRef.current = [];
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current.filter((p) => now - p.t < maxAge);
      pointsRef.current = points;

      if (points.length > 1) {
        colors.forEach((color, idx) => {
          const offset = idx * offsetFactor * 20;
          ctx.beginPath();
          points.forEach((p, i) => {
            const age = (now - p.t) / maxAge;
            const alpha = enableFade ? Math.max(0, 1 - age) : 1;
            const thickness = Math.max(3, baseThickness * (1 - age * 0.85));
            const ox = p.x + Math.sin((p.t + idx * 40) * 0.01) * offset + p.vx * 0.35;
            const oy = p.y + Math.cos((p.t + idx * 40) * 0.01) * offset + p.vy * 0.35;
            if (i === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha * 0.5;
          });
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, [colors, baseSpring, baseFriction, baseThickness, offsetFactor, maxAge, pointCount, speedMultiplier, enableFade]);

  return (
    <div
      ref={containerRef}
      className={`ribbons-container ${className}`}
      style={{ position: "relative", overflow: clipOverflow ? "hidden" : "visible", ...style }}
      {...rest}
    >
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
