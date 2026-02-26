import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNotification } from "~/contexts/NotificationContext";
import { useAuth } from "~/contexts/AuthContext";
import { useSidebar } from "~/contexts/SidebarContext";
import { dashboardService } from "~/services/dashboardService";
import Sidebar from "~/components/Sidebar/Sidebar";
import Appbar from "~/components/Appbar/Appbar";
import Overview from "./Overview/Overview";
import Container from "@mui/material/Container";
import Footer from "~/components/Footer/Footer";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import MicIcon from "@mui/icons-material/Mic";
export default function Home() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useAuth();

  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const statsResponse = await dashboardService.getStats();

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setLoading(false);
      showNotification("Failed to load data", "error");
    }
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* AppBar */}
      <Appbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {/* Content Area with Sidebar */}
      <Box
        sx={{
          display: "flex",
          height: (theme) => theme.flora.contentHeight,
          bgcolor: "background.default",
        }}
      >
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
            // py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 4, sm: 8, md: 16 },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Header Grid: Welcome + Custom Practice */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  py: { xs: 3, sm: 4, md: 6 },
                  gap: { xs: 2, sm: 3, md: 4 },
                  flexWrap: 'wrap'
                }}
              >
                {/* Welcome Message */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  sx={{ flex: 1, minWidth: { xs: '200px', sm: '300px' } }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' },
                      mb: 1,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Hello, {user?.full_name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      mx: "auto"
                    }}
                  >
                    Track your learning progress and continue your journey!
                  </Typography>
                </Box>

                {/* Custom Practice Button */}
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  elevation={0}
                  sx={{
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    color: "white",
                    borderRadius: 2, // 32px
                    overflow: "hidden",
                    // boxShadow: (theme) => `0 10px 20px ${theme.palette.primary.main}30`, // Let theme handle shadow
                    minWidth: '280px'
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate("/instruction/custom")}
                    sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%", // Circle
                        background: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <MicIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
                        Custom Instructions
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Practice any instruction
                      </Typography>
                    </Box>
                    <ArrowCircleRightIcon sx={{ ml: 'auto', opacity: 0.8 }} />
                  </CardActionArea>
                </Card>
              </Box>

              <Divider sx={{ mb: 4, width: "100%" }} />

              <Overview stats={stats} />



            </>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
