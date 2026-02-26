import React from "react";
import { Box, Container, Typography, Link, Divider, Stack } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        height: (theme) => theme.flora.footerHeight,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />}
        >
          {/* Copyright */}
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Flora. All rights reserved.
          </Typography>

          {/* Developer */}
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
        </Stack>
      </Container>
    </Box>
  );
}
