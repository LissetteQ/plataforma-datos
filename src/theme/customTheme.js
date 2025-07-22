import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0b4582' },    // Azul institucional
    secondary: { main: '#eb3c46' },  // Rojo institucional
    background: { default: '#f5f5f5' },
  },
 typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { textTransform: 'uppercase', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});

export default theme;