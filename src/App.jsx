// top-level React component—the first UI your app renders.

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SectionPage from "./pages/SectionPage.jsx";
import ClickSpark from "./components/Ribbons.jsx";
import "./App.css";
import logo from "./assets/logo.png";
import QuoteBox from "./components/QuoteBox";

function IntroAnimation({ onComplete }) {
  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="intro-mark"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <motion.rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="6"
          stroke="#49b2f2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M36 30 V70 H66"
          stroke="#0f172a"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.9,
              ease: "easeInOut",
              delay: 0.9,
            },
          }}
          onAnimationComplete={() => setTimeout(onComplete, 450)}
        />
      </motion.svg>
    </motion.div>
  );
}

export default function App() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [hasShownNav, setHasShownNav] = useState(false); // reveal nav once map is reached
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("theme-dark", theme === "dark");
    body.classList.toggle("theme-light", theme === "light");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );
  const onToggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return [...prev, tag];
    });
  };

  const handleNavToggle = useCallback((visible) => {
    // follow the current section visibility (hero hides, map shows)
    setHasShownNav(visible);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
      ) : (
        <ClickSpark className="spark-root" sparkColor="#000" key="app">
          <BrowserRouter basename="/irene_portfolio">
            <AppContent theme={theme} onToggleTheme={toggleTheme} />
          </BrowserRouter>
        </ClickSpark>
      )}
    </AnimatePresence>
  );

  function AppContent({ theme, onToggleTheme }) {
    // location is available because this component is rendered inside BrowserRouter
    const location = useLocation();
    const isHome = location.pathname === "/";
    const showNavChrome = isHome ? hasShownNav : true;
    const isDark = theme === "dark";

    return (
      <>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-pressed={isDark}
          title="Toggle dark mode"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* show these only on the home route */}
        {showNavChrome && (
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
            element={
              <>
              <Home
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                onNavToggle={handleNavToggle}
              />
              <section className="quote-section">
          <QuoteBox />
        </section>
        </>
            }
          />
          <Route
            path="/projects"
            element={<Projects selectedTags={selectedTags} onToggleTag={onToggleTag} />}
          />
          <Route path="/section/:slug" element={<SectionPage />} />
        </Routes>
      </>
    );
  }
}
