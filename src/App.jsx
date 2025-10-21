{/* top-level React component—the first UI your app renders.*/}

import React, { useRef, useState, useLayoutEffect } from "react"; //curretnly unused
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Toolbar from "./components/Toolbar";
import "./App.css";
import logo from "./assets/logo.png";

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

    <BrowserRouter basename="Irene_portfolio">
    {/* Background now handled inside NodeMap to zoom/pan with the world */}
    
    <div className="card">
      <p><span>HOME</span></p>
      <p><span>ABOUT</span></p>
      <p><span>PROJECTS</span></p>
      <p><span>CONTACT</span></p>
    </div>

  <div ref={toolbarRef} className="toolbarOverlay">
    <Toolbar
      selectedTags={selectedTags}
      onToggleTag={onToggleTag}
      onAddProject={() => alert("Add project clicked!")}
    />
   </div>

 
   <div className="toolbar-spacer"
  aria-hidden="true"
  style={{ height: toolbarHeight }} />

  {/* logo and nav */}
    <header className="app-header">
      <img src={logo} className="logo" alt="logo" />
    </header>
   
      <nav className="nav-bar">
        <Link to="/" className="nav-link">Irene</Link>
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
