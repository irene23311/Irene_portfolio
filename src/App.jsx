{/* top-level React component—the first UI your app renders.*/}

import React, { useRef, useState, useLayoutEffect } from "react"; //curretnly unused
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
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
    <BrowserRouter basename="/Irene_portfolio">
      <AppContent />
    </BrowserRouter>
  );

  function AppContent() {
    // location is available because this component is rendered inside BrowserRouter
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
      <>
        {/* show these only on the home route */}
        {isHome && (
          <>
            <div className="card">
              <Link to="/">
                <span>home</span>
              </Link>
              <Link to="/projects">
                <span>Projects</span>
              </Link>
              <Link to="/about">
                <span>about</span>
              </Link>
              <Link to="/contact">
                <span>contact</span>
              </Link>
            </div>

            <div ref={toolbarRef} className="toolbarOverlay">
              <Toolbar
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                onAddProject={() => alert("Add project clicked!")}
              />
            </div>

            <div
              className="toolbar-spacer"
              aria-hidden="true"
              style={{ height: toolbarHeight }}
            />

            {/* logo and nav */}
            <header className="app-header">
              <img src={logo} className="logo" alt="logo" />
            </header>

            <nav className="nav-bar">
              <Link to="/" className="nav-link">
                Irene
              </Link>
            </nav>
          </>
        )}

        <Routes>
          <Route
            path="/"
            element={<Home selectedTags={selectedTags} onToggleTag={onToggleTag} />}
          />
          <Route
            path="/projects"
            element={<Projects selectedTags={selectedTags} onToggleTag={onToggleTag} />}
          />
        </Routes>
      </>
    );
  }
}
