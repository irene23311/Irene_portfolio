/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { projects } from "../data/projects";
import NodeMap from "../components/NodeMap";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <NodeMap
        projects={projects}
        onProjectSelect={setSelectedProject}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        panOffset={panOffset}
        setPanOffset={setPanOffset}
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
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <button
            style={{
              marginTop: "1rem",
              background: "#8f5e5eff",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
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
