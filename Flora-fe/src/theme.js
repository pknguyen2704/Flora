import { createTheme } from "@mui/material/styles";

const APP_BAR_HEIGHT = "64px";
const FOOTER_HEIGHT = "64px";
const CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${FOOTER_HEIGHT})`;

const theme = createTheme({
  flora: {
    appBarHeight: APP_BAR_HEIGHT,
    footerHeight: FOOTER_HEIGHT,
    contentHeight: CONTENT_HEIGHT,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0052D4", // Deep professional blue
      light: "#4A90E2", // Lighter blue for accents
      dark: "#003D9E", // Darker blue for depth
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00C9FF", // Bright cyan accent
      light: "#5DDEF4", // Light cyan
      dark: "#0099CC", // Deep cyan
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981", // Modern green
      light: "#34D399",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B", // Warm orange
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444", // Modern red
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: "#3B82F6", // Info blue
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F8FAFC", // Very light blue-gray
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B", // Dark slate for readability
      secondary: "#64748B", // Medium slate
    },
    divider: "#E2E8F0", // Light divider
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for modern look
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 82, 212, 0.05)",
    "0px 4px 8px rgba(0, 82, 212, 0.08)",
    "0px 8px 16px rgba(0, 82, 212, 0.1)",
    "0px 12px 24px rgba(0, 82, 212, 0.12)",
    "0px 16px 32px rgba(0, 82, 212, 0.14)",
    "0px 20px 40px rgba(0, 82, 212, 0.16)",
    "0px 24px 48px rgba(0, 82, 212, 0.18)",
    "0px 28px 56px rgba(0, 82, 212, 0.2)",
    ...Array(16).fill("0px 32px 64px rgba(0, 82, 212, 0.22)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 82, 212, 0.15)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 6px 16px rgba(0, 82, 212, 0.2)",
          },
        },
        sizeLarge: {
          padding: "12px 32px",
          fontSize: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 12px rgba(0, 82, 212, 0.08)",
          "&:hover": {
            boxShadow: "0px 8px 24px rgba(0, 82, 212, 0.12)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0052D4",
          color: "#FFFFFF",
          boxShadow: "0px 4px 12px rgba(0, 82, 212, 0.15)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
