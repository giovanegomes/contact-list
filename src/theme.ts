import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#266369",
    },
    secondary: {
      main: "#b4babb",
    },
    background: {
      default: "#FFFBFE",
      paper: "#FFFFFF",
    },
    error: {
      main: "#600004",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: "none",
          padding: "8px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
        },
      },
    },
  },
});
