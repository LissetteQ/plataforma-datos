// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

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
import { Box } from "@mui/material";

function App() {
  return (
    <>
      {/* Enlace accesible para saltar al contenido principal */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          zIndex: 2000,
          bgcolor: "#ffffff",
          color: "#0B3D91",
          px: 2,
          py: 1,
          border: "2px solid #0B3D91",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,.12)",
          "&:focus": { left: "12px", top: "12px", outline: "none" },
        }}
      >
        Saltar al contenido principal
      </Box>

      <Navbar />

      {/* Landmark principal para lectores de pantalla */}
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trabajo" element={<Trabajo />} />
          <Route path="/salud" element={<Salud />} />
          <Route path="/educacion" element={<Educacion />} />
          <Route path="/macroeconomia" element={<Macroeconomia />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/contacto" element={<Contactanos />} />
          {/* <Route path="/documentacion" element={<Documentacion />} /> */}
          <Route path="/buscar" element={<Buscar />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
