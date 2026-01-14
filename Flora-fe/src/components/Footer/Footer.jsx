import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import { Code, Favorite } from "@mui/icons-material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        display: "flex",
        height: (theme) => theme.flora.footerHeight,
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Copyright */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          © {currentYear} Flora
        </Typography>
      </Box>

      {/* Developer Credit */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Code sx={{ fontSize: 16, color: "primary.main" }} />
        <Typography variant="body2" color="text.secondary">
          Developed by{" "}
          <Link
            href="https://github.com/pknguyen2704"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Andrew Phung
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
