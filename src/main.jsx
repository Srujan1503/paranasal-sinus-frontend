import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f766e',
      dark: '#0f3d3b',
      light: '#5dd4cf',
    },
    secondary: {
      main: '#2563eb',
    },
    background: {
      default: '#f4fbff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
