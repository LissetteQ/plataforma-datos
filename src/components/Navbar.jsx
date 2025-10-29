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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Menú visible
  const navItems = [
    { label: "Inicio", to: "/" },
    { label: "Documentación", to: "/documentacion" },
    { label: "Contáctanos", to: "/contacto" },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        minWidth: "220px",
        p: 2,
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.to}
            sx={{
              textAlign: "left",
            }}
          >
            <ListItemText
              primary={item.label.toUpperCase()}
              primaryTypographyProps={{
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.9rem",
                color: "#000",
              }}
            />
          </ListItem>
        ))}
      </List>
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
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          {/* Logo (izquierda) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
          >
            <Link to="/" style={{ display: "inline-flex" }}>
              <img
                src="/img/logoNodo_COLOR.png"
                alt="Logo Nodo XXI"
                style={{
                  height: "80px",
                  objectFit: "contain",
                }}
              />
            </Link>
          </Box>

          {/* Menú desktop centrado un poco hacia la derecha */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 3,
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              ml: 4, // 👈 pequeño desplazamiento hacia la derecha
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  color: "black",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                {item.label.toUpperCase()}
              </Button>
            ))}
          </Box>

          {/* Menú mobile (hamburguesa a la derecha) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "block", sm: "none" },
              marginLeft: "auto",
            }}
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
        >
          {drawer}
        </Drawer>
      </AppBar>
    </>
  );
};

export default Navbar;
