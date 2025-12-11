// src/components/IntroSection.jsx
import { useEffect, useRef, useState } from "react";
import ClickSpark from "./Ribbons.jsx";

export default function IntroSection({ onEnter }) {
  const [hint, setHint] = useState({ x: 0, y: 0, visible: false });
  const hideTimer = useRef(null);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      setHint((prev) => ({ ...prev, visible: false }));
      return;
    }

    const handleMove = (e) => {
      const offset = 14;
      setHint({ x: e.clientX + offset, y: e.clientY + offset, visible: true });
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(
        () => setHint((prev) => ({ ...prev, visible: false })),
        1400
      );
    };

    const handleLeave = () => setHint((prev) => ({ ...prev, visible: false }));

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [inView]);

  return (
    <div ref={sectionRef}>
      <ClickSpark className="introWrap" onClick={onEnter}>
        <div className="shape shape-plane" aria-hidden />
        <div className="shape shape-dot" aria-hidden />
        <div className="shape shape-plus" aria-hidden />
        <div className="shape shape-ring" aria-hidden />
        <div className="shape shape-square" aria-hidden />
        <div className="shape shape-triangle" aria-hidden />
        <div className="shape shape-oval" aria-hidden />
        <div className="shape shape-diamond" aria-hidden />
        <div className="shape shape-spark" aria-hidden />
        <div className="shape shape-moon" aria-hidden />

        <div className="introContent">
          <h1 className="introName">Irene Liang</h1>
          <p className="introTagline">
            My approach to design and creative coding:{" "}
            <span className="taglineEmphasis">
              I code, I design, and I film.
            </span>
          </p>
        </div>

        <div
          className="scroll-hint"
          style={{
            transform: `translate(${hint.x}px, ${hint.y}px)`,
            opacity: hint.visible ? 0.9 : 0,
          }}
        >
          Scroll down
        </div>
      </ClickSpark>
    </div>
  );
}
