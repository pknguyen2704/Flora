import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import { groupService } from "~/services/groupService";
import Sidebar from "~/components/Sidebar/Sidebar";
import Appbar from "~/components/AppBar/Appbar";
import Footer from "~/components/Footer/Footer";

export default function Groups() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const groupsResponse = await groupService.getAll();

      if (
        groupsResponse.success &&
        Array.isArray(groupsResponse.data?.groups)
      ) {
        setGroups(groupsResponse.data.groups);
      } else {
        setGroups([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
      showNotification("Failed to load data", "error");
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
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
            <Box
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Section Header */}
              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ mb: 4 }}
              >
                <Typography
                  variant="h4"
                  fontWeight="700"
                  sx={{
                    mb: 1,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Instruction Groups
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose a group to start practicing
                </Typography>
              </Box>

              {/* Groups Grid */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                  <CircularProgress size={48} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                  {error}
                </Alert>
              ) : (
                <Grid
                  component={motion.div}
                  variants={containerVariants}
                  container
                  spacing={3}
                >
                  {groups.map((group, index) => (
                    <Grid
                      component={motion.div}
                      variants={itemVariants}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={group.id || group._id || index}
                    >
                      <Card
                        component={motion.div}
                        whileHover={{
                          scale: 1.03,
                          transition: { duration: 0.2 },
                        }}
                        elevation={0}
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: group.color_hex,
                            boxShadow: `0 12px 24px ${group.color_hex}20`,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() =>
                            handleGroupClick(group.id || group._id)
                          }
                          sx={{
                            height: "100%",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Color Indicator */}
                          <Box
                            sx={{
                              width: 48,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: group.color_hex,
                              mb: 2,
                            }}
                          />

                          {/* Group Number Badge */}
                          <Chip
                            label={`Group ${group.group_number}`}
                            size="small"
                            sx={{
                              mb: 2,
                              bgcolor: `${group.color_hex}15`,
                              color: group.color_hex,
                              fontWeight: 600,
                              border: "none",
                            }}
                          />

                          {/* Group Info */}
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                            sx={{ mb: 1 }}
                          >
                            {group.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 3,
                              flex: 1,
                              lineHeight: 1.6,
                            }}
                          >
                            {group.description}
                          </Typography>

                          {/* Stats */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 3,
                              width: "100%",
                              pt: 2,
                              borderTop: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                fontWeight="600"
                                color={group.color_hex}
                              >
                                {group.instruction_count}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Instructions
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                fontWeight="600"
                                color={group.color_hex}
                              >
                                {group.situation_count}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Situations
                              </Typography>
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
