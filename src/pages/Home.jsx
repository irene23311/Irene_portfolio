/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IntroSection from "../components/IntroSection.jsx";
import InteractiveMoon from "../components/InteractiveMoon.jsx";
import "./Home.css";

export default function Home({ selectedTags = [], onToggleTag, onNavToggle = () => {} }) {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const mapRef = useRef(null);
  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Hide nav when the hero comes back into view.
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onNavToggle(false);
      },
      { threshold: 0.6 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [onNavToggle]);

  // Show/hide nav chrome based on map visibility.
  useEffect(() => {
    const mapEl = mapRef.current;
    if (!mapEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        onNavToggle(visible);
      },
      { threshold: 0.35 }
    );

    observer.observe(mapEl);
    return () => observer.disconnect();
  }, [onNavToggle]);

  return (
    <main className="page">
      {/* Section 1 — Intro (use IntroSection component) */}
      <section id="intro" ref={heroRef} className="vh">
        <IntroSection onEnter={scrollToMap} />
      </section>

      {/* Section 2 — Map (lazy mounts when scrolled into view) */}
      <section id="map" ref={mapRef} className="vh">
        <InteractiveMoon
          onAreaSelect={onToggleTag}
          activeIds={selectedTags}
          onOpenPage={(slug) => navigate(`/section/${slug}`)}
        />
      </section>
    </main>
  );
}
