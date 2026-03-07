import { createTheme } from "@mui/material/styles";

const APP_BAR_HEIGHT = "72px";
const FOOTER_HEIGHT = "80px";
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
      main: "#4F46E5",
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#7C3AED",
      light: "#A78BFA",
      dark: "#5B21B6",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#22C55E",
      light: "#4ADE80",
      dark: "#16A34A",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#EF4444",
    },

    info: {
      main: "#22D3EE",
    },

    background: {
      default: "#F8FAFF",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#020617",
      secondary: "#334155",
    },

    divider: "#CBD5E1",
  },

  typography: {
    fontFamily: [
      "Inter",
      "Be Vietnam Pro",
      "Roboto",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontWeight: 800,
      fontSize: "3rem",
      letterSpacing: "-0.03em",
    },

    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: "-0.02em",
    },

    h3: {
      fontWeight: 700,
      fontSize: "1.875rem",
    },

    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },

    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },

    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },

    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 500,
      color: "#475569",
    },

    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },

  shape: {
    borderRadius: 16,
  },

  shadows: [
    "none",
    "0px 2px 4px rgba(15,23,42,0.04)",
    "0px 4px 8px rgba(15,23,42,0.06)",
    "0px 8px 16px rgba(15,23,42,0.08)",
    "0px 12px 24px rgba(15,23,42,0.1)",
    "0px 16px 32px rgba(15,23,42,0.12)",
    "0px 20px 40px rgba(15,23,42,0.14)",
    "0px 24px 48px rgba(15,23,42,0.16)",
    "0px 28px 56px rgba(15,23,42,0.18)",
    ...Array(16).fill("0px 32px 64px rgba(15,23,42,0.2)"),
  ],

  components: {

    // MuiButton: {
    //   defaultProps: {
    //     disableElevation: true,
    //   },

    //   styleOverrides: {
    //     root: {
    //       borderRadius: 12,
    //       padding: "10px 24px",
    //       transition: "all .2s ease",
    //     },

    //     contained: {
    //       background:
    //         "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",

    //       "&:hover": {
    //         transform: "translateY(-2px)",
    //         boxShadow: "0 10px 22px rgba(79,70,229,0.35)",
    //         background:
    //           "linear-gradient(135deg,#4338CA 0%,#6D28D9 100%)",
    //       },

    //       "&:active": {
    //         transform: "translateY(0)",
    //       },
    //     },

    //     outlined: {
    //       borderWidth: "2px",

    //       "&:hover": {
    //         borderWidth: "2px",
    //         backgroundColor: "#EEF2FF",
    //       },
    //     },

    //     sizeLarge: {
    //       padding: "14px 32px",
    //       fontSize: "1.1rem",
    //       borderRadius: 14,
    //     },
    //   },
    // },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: "1px solid #E2E8F0",
          boxShadow: "0px 4px 20px rgba(15,23,42,0.05)",
          transition: "all .3s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 14px 34px rgba(15,23,42,0.1)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 24,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },

        filled: {
          backgroundColor: "#EEF2FF",

          "&:hover": {
            backgroundColor: "#E0E7FF",
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },

      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            backgroundColor: "#F8FAFF",

            "& fieldset": {
              borderColor: "#E2E8F0",
            },

            "&:hover fieldset": {
              borderColor: "#C7D2FE",
            },

            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",

              "& fieldset": {
                borderWidth: "2px",
                borderColor: "#4F46E5",
              },
            },
          },

          "& .MuiInputLabel-root": {
            color: "#64748B",

            "&.Mui-focused": {
              color: "#4F46E5",
            },
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          color: "#0F172A",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 1px 0px #E2E8F0",
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: "1px solid #E2E8F0",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",

          "&:hover": {
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
          },
        },
      },
    },

  },
});

export default theme;