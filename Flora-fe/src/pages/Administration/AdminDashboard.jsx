import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  People,
  Article,
  Assessment,
  Settings,
  Dashboard as DashboardIcon,
  School,
  RecordVoiceOver,
  Quiz,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Appbar from "~/components/AppBar/Appbar";
import Footer from "~/components/footer/Footer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const adminSections = [
    {
      title: "User Monitoring",
      description:
        "View and manage all users, track progress, and monitor activity",
      icon: <People sx={{ fontSize: 48 }} />,
      color: "#0052D4",
      path: "/admin/users",
      stats: { total: 1234, active: 856 },
    },
    {
      title: "Content Management",
      description:
        "Manage groups, instructions, situations, and learning materials",
      icon: <Article sx={{ fontSize: 48 }} />,
      color: "#4A90E2",
      path: "/admin/content",
      stats: { groups: 12, instructions: 240 },
    },
    {
      title: "Analytics & Reports",
      description:
        "View detailed analytics, usage statistics, and generate reports",
      icon: <Assessment sx={{ fontSize: 48 }} />,
      color: "#00C853",
      path: "/admin/analytics",
      stats: { sessions: 5678, avgScore: 85 },
    },
    {
      title: "System Settings",
      description:
        "Configure system settings, AI parameters, and application preferences",
      icon: <Settings sx={{ fontSize: 48 }} />,
      color: "#FF6D00",
      path: "/admin/settings",
      stats: { uptime: "99.9%", version: "1.0.0" },
    },
  ];

  const quickStats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: <People />,
      color: "#0052D4",
    },
    { label: "Total Groups", value: "12", icon: <School />, color: "#4A90E2" },
    {
      label: "Instructions",
      value: "240",
      icon: <RecordVoiceOver />,
      color: "#00C853",
    },
    { label: "Situations", value: "180", icon: <Quiz />, color: "#FF6D00" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Appbar />

      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ mb: 4 }}
          >
            <Typography
              variant="h3"
              fontWeight="700"
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Administration Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your platform, monitor users, and configure settings
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mb: 4 }}
          >
            {quickStats.map((stat, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                component={motion.div}
                variants={itemVariants}
              >
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: stat.color,
                      boxShadow: `0 8px 16px ${stat.color}20`,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: `${stat.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color={stat.color}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Admin Sections */}
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {adminSections.map((section, index) => (
              <Grid
                item
                xs={12}
                md={6}
                key={index}
                component={motion.div}
                variants={itemVariants}
              >
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: section.color,
                      boxShadow: `0 12px 24px ${section.color}20`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(section.path)}
                    sx={{ height: "100%", p: 3 }}
                  >
                    <Box sx={{ display: "flex", gap: 3 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 3,
                          bgcolor: `${section.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: section.color,
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight="600" gutterBottom>
                          {section.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {section.description}
                        </Typography>

                        {/* Stats */}
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                          {Object.entries(section.stats).map(([key, value]) => (
                            <Box
                              key={key}
                              sx={{
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key}
                              </Typography>
                              <Typography variant="body2" fontWeight="600">
                                {value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Container>
  );
}
