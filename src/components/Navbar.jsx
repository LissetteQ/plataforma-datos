// src/components/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((p) => !p);
  };

  const navItems = [
    { label: "Inicio", to: "/" },
    { label: "Contáctanos", to: "/contacto" },
  ];

  const drawerTitleId = "mobile-menu-title";

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", minWidth: "240px", p: 2 }}
      role="presentation"
    >
      <Typography
        id={drawerTitleId}
        component="h2"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(1px, 1px, 1px, 1px)",
          whiteSpace: "nowrap",
        }}
      >
        Menú de navegación
      </Typography>

      <nav aria-label="Navegación principal (móvil)">
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              component={NavLink}
              to={item.to}
              end
              style={({ isActive }) => ({
                textDecoration: "none",
                background: isActive ? "rgba(0,0,0,0.04)" : "transparent",
              })}
              sx={{ textAlign: "left", borderRadius: 1 }}
            >
              <ListItemText
                primary={item.label.toUpperCase()}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.95rem",
                  color: "#000",
                }}
              />
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
        }}
        role="banner"
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            gap: 2,
          }}
        >
          {/* Logo (izquierda) */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <NavLink to="/" aria-label="Ir al inicio - Nodo XXI" style={{ display: "inline-flex" }}>
              <img
                src="/img/logoNodo_COLOR.png"
                alt="Nodo XXI — Datos para la democracia"
                style={{ height: "80px", objectFit: "contain" }}
              />
            </NavLink>
          </Box>

          {/* Empuja el menú hacia la derecha en desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} />

          {/* Menú desktop alineado a la derecha */}
          <Box
            component="nav"
            aria-label="Navegación principal"
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 3,
              alignItems: "center",
              justifyContent: "flex-end",
              ml: "auto",
              pr: { sm: 1, md: 2, lg: 4 },
              minWidth: { sm: 220 }, // evita que se pegue al centro
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.to}
                end
                sx={{
                  color: "black",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                  "&.active": {
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  },
                }}
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {item.label.toUpperCase()}
              </Button>
            ))}
          </Box>

          {/* Menú mobile (hamburguesa a la derecha) */}
          <IconButton
            color="inherit"
            aria-label="Abrir menú de navegación"
            aria-haspopup="menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen ? "true" : "false"}
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", sm: "none" }, marginLeft: "auto" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Drawer mobile */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: "block", sm: "none" } }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerTitleId}
          PaperProps={{
            id: "mobile-menu",
            component: "div",
            role: "document",
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </>
  );
};

export default Navbar;
