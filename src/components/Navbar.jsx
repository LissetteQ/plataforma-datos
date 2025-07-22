// src/components/Navbar.jsx
import React from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Explorar Datos', to: '/explorar-datos' },
    { label: 'Herramientas', to: '/herramientas' },
    { label: 'Documentación', to: '/documentacion' },
    { label: 'Acerca de', to: '/acerca-de' },
    { label: 'Contacto', to: '/contacto' },
    { label: 'Soporte', to: '/soporte' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} component={Link} to={item.to}>
            <ListItemText primary={item.label} />
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
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          px: 3,
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo más grande */}
          <Box sx={{ mr: 4 }}>
            <Link to="/">
              <img
                src="/img/logoNodo_COLOR.png"
                alt="Logo Nodo XXI"
                style={{
                  height: '80px', // aumentamos el tamaño
                  objectFit: 'contain',
                }}
              />
            </Link>
          </Box>

          {/* Menú central */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              gap: 3,
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  color: 'black',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.875rem',
                }}
              >
                {item.label.toUpperCase()}
              </Button>
            ))}
          </Box>

          {/* Icono menú mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', sm: 'none' }, ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Drawer para móvil */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </>
  );
};

export default Navbar;
