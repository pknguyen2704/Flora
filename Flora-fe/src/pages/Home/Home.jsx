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
} from "@mui/material";
import { motion } from "framer-motion";
import { useNotification } from "~/contexts/NotificationContext";
import { useAuth } from "~/contexts/AuthContext";
import { useSidebar } from "~/contexts/SidebarContext";
import { dashboardService } from "~/services/dashboardService";
import Sidebar from "~/components/Sidebar/Sidebar";
import Appbar from "~/components/AppBar/Appbar";
import Overview from "./Overview/Overview";
import Container from "@mui/material/Container";
import Footer from "~/components/Footer/Footer";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import MicIcon from '@mui/icons-material/Mic';
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
            py: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
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
                {/* Welcome Header */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{ mb: 4, textAlign: "center" }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    sx={{
                      mb: 1,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Welcome back, {user?.fullName || user?.username}! 👋
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Track your learning progress and continue your journey
                  </Typography>
                </Box>

                <Overview stats={stats} />

                {/* Featured Card - Custom Pronunciation */}
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: 1.01,
                    y: -4,
                  }}
                  elevation={0}
                  sx={{
                    mb: 4,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
                    color: "white",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: (theme) =>
                      `0 20px 40px ${theme.palette.primary.main}30`,
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate("/instruction/custom")}
                    sx={{ p: 4 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        <MicIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                          Custom Instructions Practice
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Enter any instruction and get instant AI-powered feedback
                        </Typography>
                      </Box>
                      <Box>
                        <ArrowCircleRightIcon sx={{ color: "white", fontSize: "2rem" }}/>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>

                {/* Recent Activity */}
                {stats?.pronunciation?.recent_attempts?.length > 0 && (
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="700" gutterBottom>
                        Recent Practice Sessions
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {stats.pronunciation.recent_attempts
                          .slice(0, 5)
                          .map((attempt, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 2,
                                borderBottom:
                                  idx <
                                  stats.pronunciation.recent_attempts.slice(
                                    0,
                                    5
                                  ).length -
                                    1
                                    ? "1px solid"
                                    : "none",
                                borderColor: "divider",
                              }}
                            >
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {attempt.instruction_text}
                              </Typography>
                              <Chip
                                label={`${attempt.score}%`}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  background: (theme) =>
                                    attempt.score >= 90
                                      ? theme.palette.success.main
                                      : attempt.score >= 70
                                      ? theme.palette.warning.main
                                      : theme.palette.error.main,
                                  color: "white",
                                }}
                              />
                            </Box>
                          ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
