import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Chip,
  CardActionArea,
} from "@mui/material";
import { RecordVoiceOver, Quiz, ArrowForward } from "@mui/icons-material";
import { groupService } from "~/services/groupService";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/AppBar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";

export default function GroupDetail() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  // Try to get group from navigation state first
  const [group, setGroup] = useState(location.state?.group || null);
  const [loading, setLoading] = useState(!location.state?.group);

  useEffect(() => {
    // Only fetch if we don't have group data from navigation state
    if (!group) {
      const loadGroup = async () => {
        try {
          const response = await groupService.getById(groupId);
          if (response.success) {
            setGroup(response.data);
          }
        } catch {
          showNotification("Failed to load group", "error");
        } finally {
          setLoading(false);
        }
      };

      if (groupId) {
        loadGroup();
      }
    }
  }, [groupId, showNotification, group]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!group) {
    return (
      <Container>
        <Typography>Group not found</Typography>
      </Container>
    );
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Appbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: (theme) => theme.flora.contentHeight,
          bgcolor: "background.default",
        }}
      >
        {/* Sidebar - Collapsed by default */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              px: { xs: 2, sm: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Hero Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
              }}
            >
              <Chip
                label={`Group ${group.group_number}`}
                sx={{
                  mb: 2,
                  bgcolor: `${group.color_hex}20`,
                  color: group.color_hex,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 2,
                }}
              />
              <Typography
                variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: `linear-gradient(135deg, ${group.color_hex} 0%, ${group.color_hex}99 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {group.name}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  maxWidth: { xs: '100%', sm: 600 },
                  textAlign: "center"
                }}
              >
                {group.description}
              </Typography>
            </Box>

            {/* Activity Cards */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                p: 4,
              }}
            >
              {/* Pronunciation Practice */}
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  width: "40%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${group.color_hex}20`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/pronunciation/${groupId}`)}
                  sx={{ height: "100%" }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: "primary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      <RecordVoiceOver
                        sx={{ fontSize: 32, color: "primary.main" }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography variant="h5" fontWeight="600" gutterBottom>
                      Pronunciation Practice
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, flex: 1 }}
                    >
                      Practice classroom instructions with AI-powered feedback
                    </Typography>

                    {/* Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight="600"
                          color="primary.main"
                        >
                          {group.instruction_count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Instructions
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ color: "primary.main" }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>

              {/* Situation Quiz */}
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  width: "40%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: "secondary.main",
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${group.color_hex}20`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/situations/quiz/${groupId}`)}
                  sx={{ height: "100%" }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: "secondary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      <Quiz sx={{ fontSize: 32, color: "secondary.main" }} />
                    </Box>

                    {/* Title */}
                    <Typography variant="h5" fontWeight="600" gutterBottom>
                      Situation Quiz
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, flex: 1 }}
                    >
                      Test your knowledge with classroom scenarios
                    </Typography>

                    {/* Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight="600"
                          color="secondary.main"
                        >
                          {group.situation_count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Situations
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ color: "secondary.main" }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Container >
        </Box >
      </Box >

      <Footer />
    </Container >
  );
}
