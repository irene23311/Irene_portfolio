/* eslint-disable react/prop-types */
import { useState, useMemo, useLayoutEffect } from "react";
import { projects } from "../data/projects";
import NodeMap from "../components/NodeMap";
import bgImg from '../assets/Gemini_edit.jpg';

export default function Home({ selectedTags = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  // Define world dimensions to match NodeMap's world
  const worldWidth = 2000; 
  const worldHeight = 1400; 

  // Center the world on initial mount
  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const z = zoomLevel; // initial zoom
    setPanOffset({
      x: vw / 2 - (worldWidth * z) / 2,
      y: vh / 2 - (worldHeight * z) / 2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter projects by selected tags. If no tags selected, return all projects.
  const filteredProjects = useMemo(() => {
    if (!selectedTags || selectedTags.length === 0) return projects;
    return projects.filter((p) =>
      // project must include all selected tags
      selectedTags.every((tag) => p.tags.includes(tag))
    );
  }, [selectedTags]);

  // Define connections between nodes (from id -> to id)
  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 6 },
    { from: 1, to: 6 },
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <NodeMap
        projects={filteredProjects}
        onProjectSelect={setSelectedProject}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        panOffset={panOffset}
        setPanOffset={setPanOffset}
        worldWidth={worldWidth}
        worldHeight={worldHeight}
        connections={connections}
        lineColor="#f48814ff"
        lineWidth={3}
        lineOpacity={0.8}
        backgroundImageUrl={bgImg}
        backgroundOpacity={0.9}
        backgroundSize={'contain'}
        backgroundRepeat={'no-repeat'}
        backgroundPosition={'center'}
      />

      {selectedProject && (
        <div
          className="absolute top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto"
          style={{ borderLeft: "1px solid #ddd" }}
        >
          <h2>{selectedProject.title}</h2>
          <p>{selectedProject.description}</p>
          <img
            src={selectedProject.heroImage}
            alt={selectedProject.title}
            style={{ width: "50%", borderRadius: "8px" }}
          />
          <button
            style={{
              marginTop: "2rem",
              background: "#8f5e5eff",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
            onClick={() => setSelectedProject(null)}
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
