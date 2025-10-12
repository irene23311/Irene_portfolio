{/* top-level React component—the first UI your app renders.*/}

import React, { useRef, useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Toolbar from "./components/Toolbar";
import "./App.css";

export default function App() {
  const [selectedTags, setSelectedTags] = useState([]);
  const toolbarRef=useRef(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const onToggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return [...prev, tag];
    });
  };
  useLayoutEffect(() => {
    const toolbarEl=toolbarRef.current;
    if(!toolbarEl) return;

    const updateHeight=()=> {
      const rect=toolbarEl.getBoundingClientRect();
      setToolbarHeight(rect.height);
    }
    updateHeight();

    const observer=new ResizeObserver(updateHeight);
    observer.observe(toolbarEl);
    return () => observer.disconnect();
  },[]);
  return (
    <BrowserRouter>
  <div ref={toolbarRef}className="toolbarOverlay">
    <Toolbar
      selectedTags={selectedTags}
      onToggleTag={onToggleTag}
      onAddProject={() => alert("Add project clicked!")}
    />
   </div>
   {/* spacer matches toolbar height so page content doesn't jump under fixed toolbar */}
   <div className="toolbar-spacer"
  aria-hidden="true"
  style={{ height: toolbarHeight }} />
      <nav 
      // Inline styles for the nav element
        style={{ 
          position: "fixed",
          top: 200,
          left: 0,
          width: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
          margin: 0,
          height: "50px",
          boxSizing: "border-box",
          padding: "10px"
        }}
      >
        <Link
         to="/"
         style={{
        backgroundColor: "#f9fafb",
        color: "#333",
        padding: "5px 10px",
        borderRadius: "8px",
        textDecoration: "none"
        }}
         >Home</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Home selectedTags={selectedTags} onToggleTag={onToggleTag} />}
        />
      </Routes>

    </BrowserRouter>
  );
}
