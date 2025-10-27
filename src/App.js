import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mapa from './pages/Mapa';
import Educacion from './pages/Educacion';
import Macroeconomia from './pages/Macroeconomia';
import Salud from './pages/Salud';
import Trabajo from './pages/Trabajo';
import ExplorarDatos from './pages/ExplorarDatos';
import Documentacion from './pages/Documentacion';
import AcercaDe from './pages/AcercaDe';
import Contactanos from './pages/Contactanos';
import Soporte from './pages/Soporte';
import Herramientas from './pages/Herramientas';

const theme = createTheme({
  palette: {
    primary: { main: '#0B3D91' },
    secondary: { main: '#ef3e50' },
    background: { default: '#F4F4F4' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Navbar />
          <Box component="main" sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorar-datos" element={<ExplorarDatos />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/educacion" element={<Educacion />} />
              <Route path="/macroeconomia" element={<Macroeconomia />} />
              <Route path="/salud" element={<Salud />} />
              <Route path="/trabajo" element={<Trabajo />} />
              <Route path="/documentacion" element={<Documentacion />} />
              <Route path="/acerca-de" element={<AcercaDe />} />
              <Route path="/contacto" element={<Contactanos />} />
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/herramientas" element={<Herramientas />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}