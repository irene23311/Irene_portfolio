{/* top-level React component—the first UI your app renders.*/}

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Toolbar from "./components/Toolbar";

export default function App() {
  return (
    <BrowserRouter>
    <main style={{ padding: "24px" }}>
      <Toolbar onAddProject={() => alert("Add project clicked!")} />
    </main>
      <nav style={{ padding: 12 }}>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
