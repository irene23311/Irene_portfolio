{/* top-level React component—the first UI your app renders.*/}

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Toolbar from "./components/Toolbar";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
  <div className="toolbarOverlay">
    <Toolbar onAddProject={() => alert("Add project clicked!")} />
   </div>
   {/* spacer matches toolbar height so page content doesn't jump under fixed toolbar */}
   <div className="toolbar-spacer" aria-hidden="true" />
      <nav style={{ padding: 12}}>
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
        <Route path="/" element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
}
