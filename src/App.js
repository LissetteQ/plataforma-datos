import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas principales
import Home from "./pages/Home.jsx";
import Trabajo from "./pages/Trabajo.jsx";
import Salud from "./pages/Salud.jsx";
import Educacion from "./pages/Educacion.jsx";
import Macroeconomia from "./pages/Macroeconomia.jsx";
import Mapa from "./pages/Mapa.jsx";
import Contactanos from "./pages/Contactanos.jsx";
import Documentacion from "./pages/Documentacion.jsx";
import Buscar from "./pages/Buscar.jsx";

// 👇 IMPORTANTE: no importamos Buscar
// import Buscar from "./pages/Buscar.jsx";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trabajo" element={<Trabajo />} />
        <Route path="/salud" element={<Salud />} />
        <Route path="/educacion" element={<Educacion />} />
        <Route path="/macroeconomia" element={<Macroeconomia />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/contacto" element={<Contactanos />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/buscar" element={<Buscar/>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
