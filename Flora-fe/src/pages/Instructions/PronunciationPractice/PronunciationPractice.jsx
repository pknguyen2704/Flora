import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Mic,
  VolumeUp,
  CheckCircle,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  FormatListBulleted,
  EmojiEvents,
  Assessment,
  EditNote,
  RecordVoiceOver,
  Psychology,
  ArrowForward,
  TrendingDown,
  TrendingUp,
  Quiz as QuizIcon,
} from "@mui/icons-material";
import AudioRecorder from "~/components/shared/AudioRecorder";
import { pronunciationService } from "~/services/pronunciationService";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/Appbar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";

const PANEL_WIDTH_EXPANDED = 360;
const PANEL_WIDTH_COLLAPSED = 80;

export default function PronunciationPractice() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const {
    collapsed: sidebarCollapsed,
    setCollapsed,
    toggleSidebar,
  } = useSidebar();

  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Instruction panel toggle
  const [panelExpanded, setPanelExpanded] = useState(true);

  // Selected instruction and recording state
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [groupName, setGroupName] = useState("");


  const loadInstructions = async () => {
    try {
      const response = await pronunciationService.getInstructions(groupId);
      if (response.success) {
        setInstructions(response.data.instructions || []);
        setGroupName(response.data.group_name || "");
      }
    } catch {
      showNotification("Failed to load instructions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      loadInstructions();
    }
  }, [groupId, showNotification]);

  const handleSelectInstruction = (inst) => {
    setSelectedInstruction(inst);
    setShowRecorder(false);
    setRecordedAudio(null);
    setAssessment(null);
  };

  const handleStartRecording = () => {
    setShowRecorder(true);
    setRecordedAudio(null);
    setAssessment(null);
  };

  const handleRecordingReady = (audioBlob) => {
    setRecordedAudio(audioBlob);
  };

  const handleListenText = () => {
    if (!selectedInstruction?.text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedInstruction.text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitRecording = async () => {
    if (!recordedAudio || !selectedInstruction) return;

    setSubmitting(true);
    try {
      const audioFile = new File([recordedAudio], "recording.wav", {
        type: "audio/wav",
      });

      const response = await pronunciationService.assessPronunciation(
        audioFile,
        selectedInstruction.id,
        null,
        sessionId
      );

      if (response.success) {
        setAssessment(response.data.assessment);
        setUserStats(response.data.user_stats);

        // Refresh the instructions list to update stats
        loadInstructions();

        // Fetch recommendations after a successful submission
        handleGetRecommendations();
      }
    } catch {
      showNotification("Assessment failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetRecommendations = async () => {
    console.log("🔍 Fetching recommendations for groupId:", groupId, "excluding:", selectedInstruction?.id);
    setLoadingRecommendations(true);
    try {
      const response = await pronunciationService.getRecommendations(
        groupId,
        selectedInstruction?.id,  // Exclude current instruction
        5
      );
      console.log("📊 Recommendations response:", response);
      if (response.success) {
        const recs = response.data.recommendations || [];
        console.log("✅ Setting recommendations:", recs.length, "items", recs);
        setRecommendations(recs);
      } else {
        console.warn("⚠️ Recommendations fetch not successful:", response);
      }
    } catch (error) {
      console.error("❌ Failed to load recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSelectRecommendedInstruction = (instructionId) => {
    const instruction = instructions.find(inst => inst.id === instructionId);
    if (instruction) {
      handleSelectInstruction(instruction);
      // Scroll to top of practice area
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTryAgain = () => {
    setShowRecorder(false);
    setRecordedAudio(null);
    setAssessment(null);
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return "linear-gradient(135deg, #10B981 0%, #34D399 100%)";
    if (score >= 70) return "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)";
    return "linear-gradient(135deg, #EF4444 0%, #F87171 100%)";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: "success",
      moderate: "warning",
      severe: "error",
    };
    return colors[severity] || "default";
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <Appbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <Box
        sx={{
          display: "flex",
          height: (theme) => theme.flora.contentHeight,
          bgcolor: "background.default",
        }}
      >
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Instruction List Panel - Left Side */}
        <Box
          sx={{
            width: panelExpanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH_COLLAPSED,
            minWidth: panelExpanded
              ? PANEL_WIDTH_EXPANDED
              : PANEL_WIDTH_COLLAPSED,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
            backdropFilter: "blur(10px)",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            position: "relative",
            boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
          }}
        >
          {/* Panel Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: panelExpanded ? "space-between" : "center",
              p: panelExpanded ? 2.5 : 1.5,
              background: panelExpanded
                ? "linear-gradient(135deg, rgba(0,82,212,0.08) 0%, rgba(0,201,255,0.05) 100%)"
                : "transparent",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              minHeight: 72,
            }}
          >
            {panelExpanded ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      background:
                        "linear-gradient(135deg, #0052D4 0%, #00C9FF 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(0, 82, 212, 0.35)",
                    }}
                  >
                    <FormatListBulleted sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{ lineHeight: 1.2 }}
                    >
                      Instructions
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {instructions.length}{" "}
                      {instructions.length === 1 ? "item" : "items"}
                    </Typography>
                  </Box>
                </Box>
                {/* Hide Button */}
                <Tooltip title="Hide list" placement="bottom" arrow>
                  <Box
                    onClick={() => setPanelExpanded(false)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      bgcolor: "rgba(0,0,0,0.04)",
                      "&:hover": {
                        bgcolor: "rgba(0,82,212,0.1)",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <KeyboardDoubleArrowLeft
                      sx={{ fontSize: 20, color: "text.secondary" }}
                    />
                  </Box>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Show instructions" placement="right" arrow>
                <Box
                  onClick={() => setPanelExpanded(true)}
                  sx={{
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    maxWidth: 48,
                    minHeight: 48,
                    maxHeight: 48,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #0052D4 0%, #00C9FF 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(0, 82, 212, 0.35)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.08)",
                      boxShadow: "0 6px 20px rgba(0, 82, 212, 0.45)",
                    },
                  }}
                >
                  <KeyboardDoubleArrowRight
                    sx={{ color: "white", fontSize: 24 }}
                  />
                </Box>
              </Tooltip>
            )}
          </Box>

          {/* Instructions List */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: panelExpanded ? 2 : 1,
              "&::-webkit-scrollbar": {
                width: 6,
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.1)",
                borderRadius: 3,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {instructions.map((inst, index) => {
                  const isSelected = selectedInstruction?.id === inst.id;
                  const hasScore = inst.user_stats?.best_score != null;
                  const score = inst.user_stats?.best_score;

                  return (
                    <ListItem
                      key={inst.id}
                      disablePadding
                      sx={{
                        mb: 1,
                        animation: `fadeSlideIn 0.3s ease-out ${index * 0.05
                          }s both`,
                        "@keyframes fadeSlideIn": {
                          from: { opacity: 0, transform: "translateX(-10px)" },
                          to: { opacity: 1, transform: "translateX(0)" },
                        },
                      }}
                    >
                      {panelExpanded ? (
                        <ListItemButton
                          onClick={() => handleSelectInstruction(inst)}
                          sx={{
                            borderRadius: 2,
                            background: isSelected
                              ? "linear-gradient(135deg, rgba(0,82,212,0.12) 0%, rgba(0,201,255,0.08) 100%)"
                              : "rgba(255,255,255,0.6)",
                            border: "1px solid",
                            borderColor: isSelected
                              ? "primary.main"
                              : "rgba(0,0,0,0.06)",
                            p: 2,
                            transition: "all 0.25s ease",
                            boxShadow: isSelected
                              ? "0 4px 20px rgba(0, 82, 212, 0.15)"
                              : "0 2px 8px rgba(0,0,0,0.03)",
                            "&:hover": {
                              background: isSelected
                                ? "linear-gradient(135deg, rgba(0,82,212,0.15) 0%, rgba(0,201,255,0.1) 100%)"
                                : "rgba(0,82,212,0.04)",
                              transform: "translateX(6px)",
                              boxShadow: "0 4px 16px rgba(0,82,212,0.12)",
                              borderColor: isSelected
                                ? "primary.main"
                                : "rgba(0,82,212,0.2)",
                            },
                          }}
                        >
                          <Box sx={{ width: "100%" }}>
                            {/* Header Row */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 2,
                                  background: isSelected
                                    ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                                    : "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  color: isSelected ? "white" : "primary.dark",
                                }}
                              >
                                #{inst.instruction_number}
                              </Box>
                              {hasScore && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 2,
                                    background: getScoreGradient(score),
                                    boxShadow: `0 2px 8px ${score >= 90
                                      ? "rgba(16,185,129,0.3)"
                                      : score >= 70
                                        ? "rgba(245,158,11,0.3)"
                                        : "rgba(239,68,68,0.3)"
                                      }`,
                                  }}
                                >
                                  <EmojiEvents
                                    sx={{ fontSize: 14, color: "white" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 700,
                                      color: "white",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    {score}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            {/* Instruction Text */}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 500,
                                lineHeight: 1.6,
                                color: isSelected
                                  ? "primary.dark"
                                  : "text.primary",
                              }}
                            >
                              {inst.text}
                            </Typography>
                            {/* Attempts */}
                            {inst.user_stats?.attempts_count > 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 1,
                                  display: "block",
                                  color: "text.secondary",
                                  fontWeight: 500,
                                }}
                              >
                                {inst.user_stats.attempts_count}{" "}
                                {inst.user_stats.attempts_count === 1
                                  ? "attempt"
                                  : "attempts"}
                              </Typography>
                            )}
                          </Box>
                        </ListItemButton>
                      ) : (
                        <Tooltip title={inst.text} placement="right" arrow>
                          <ListItemButton
                            onClick={() => handleSelectInstruction(inst)}
                            sx={{
                              width: 56,
                              height: 56,
                              minWidth: 56,
                              maxWidth: 56,
                              minHeight: 56,
                              maxHeight: 56,
                              borderRadius: "50%",
                              mx: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 0,
                              flexShrink: 0,
                              background: isSelected
                                ? "linear-gradient(135deg, rgba(0,82,212,0.12) 0%, rgba(0,201,255,0.08) 100%)"
                                : "transparent",
                              border: "1px solid",
                              borderColor: isSelected
                                ? "primary.main"
                                : "transparent",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: isSelected
                                  ? "linear-gradient(135deg, rgba(0,82,212,0.15) 0%, rgba(0,201,255,0.1) 100%)"
                                  : "rgba(0,82,212,0.06)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                background: hasScore
                                  ? getScoreGradient(score)
                                  : isSelected
                                    ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                                    : "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
                                color:
                                  hasScore || isSelected
                                    ? "white"
                                    : "primary.dark",
                                boxShadow:
                                  hasScore || isSelected
                                    ? "0 2px 8px rgba(0,82,212,0.25)"
                                    : "none",
                              }}
                            >
                              {inst.instruction_number}
                            </Box>
                          </ListItemButton>
                        </Tooltip>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>

        </Box>

        {/* Main Content Area - Right Side */}
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
          <Container
            maxWidth="lg"
            sx={{
              px: { xs: 2, sm: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center", maxWidth: 700 }}>
              {groupName && (
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    letterSpacing: 1.5,
                    mb: 1,
                    display: "block",
                  }}
                >
                  {groupName}
                </Typography>
              )}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #0052D4 0%, #00C9FF 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Pronunciation Practice
              </Typography>
              {!assessment && (
                <Typography variant="body1" color="text.secondary">
                  {panelExpanded
                    ? "Select an instruction from the list to practice"
                    : "Click the arrow to expand the instruction list"}
                </Typography>
              )}
            </Box>

            {/* No Selection Message */}
            {!selectedInstruction && !loading && (
              <Card
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  maxWidth: 500,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Mic sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Ready to Practice?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select an instruction from the list to start practicing your
                  pronunciation
                </Typography>
              </Card>
            )}

            {/* Practice Area - Shows when instruction is selected */}
            {selectedInstruction && (
              <Box sx={{ maxWidth: 700, width: "100%" }}>
                {/* Instruction Display & Recording Controls */}
                {!assessment && (
                  <Card
                    sx={{
                      mb: 3,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "0 8px 32px rgba(0, 82, 212, 0.08)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      {!showRecorder && (
                        <>
                          <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Chip
                              label={`Instruction #${selectedInstruction.instruction_number}`}
                              sx={{
                                mb: 2,
                                px: 2,
                                fontWeight: 600,
                                background:
                                  "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)",
                                color: "white",
                              }}
                            />
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                lineHeight: 1.4,
                              }}
                            >
                              "{selectedInstruction.text}"
                            </Typography>
                            {selectedInstruction.user_stats?.attempts_count > 0 && (
                              <Box
                                sx={{
                                  mt: 3,
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    background: getScoreGradient(
                                      selectedInstruction.user_stats.best_score
                                    ),
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <TrendingUp sx={{ color: "white", fontSize: 18 }} />
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "white", fontWeight: 700 }}
                                  >
                                    Best: {selectedInstruction.user_stats.best_score}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    background: getScoreGradient(
                                      selectedInstruction.user_stats.worst_score
                                    ),
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <TrendingDown sx={{ color: "white", fontSize: 18 }} />
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "white", fontWeight: 700 }}
                                  >
                                    Worst: {selectedInstruction.user_stats.worst_score}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              justifyContent: "center",
                              mt: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<VolumeUp />}
                              onClick={handleListenText}
                              sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: "1rem",
                                fontWeight: 700,
                                background: (theme) =>
                                  `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                                boxShadow: (theme) => theme.shadows[6],
                                borderRadius: 3,
                                textTransform: "none",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: (theme) => theme.shadows[10],
                                  background: (theme) =>
                                    `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                                },
                              }}
                            >
                              Listen
                            </Button>
                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<Mic />}
                              onClick={handleStartRecording}
                              sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: "1rem",
                                fontWeight: 700,
                                background: (theme) =>
                                  `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                                boxShadow: (theme) => theme.shadows[6],
                                borderRadius: 3,
                                textTransform: "none",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: (theme) => theme.shadows[10],
                                  background: (theme) =>
                                    `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                                },
                              }}
                            >
                              Start Recording
                            </Button>
                          </Box>
                        </>
                      )}

                      {/* Recording Section */}
                      {showRecorder && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 3,
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: (theme) =>
                                  `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                boxShadow: (theme) => theme.shadows[3],
                              }}
                            >
                              <Mic sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              Recording
                            </Typography>
                          </Box>

                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              mb: 3,
                              borderRadius: 2,
                              background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              color: "white",
                              boxShadow: (theme) => theme.shadows[4],
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                lineHeight: 1.6,
                                fontStyle: "italic",
                              }}
                            >
                              "{selectedInstruction.text}"
                            </Typography>
                          </Paper>

                          <AudioRecorder
                            onRecordingReady={handleRecordingReady}
                            onSubmit={handleSubmitRecording}
                            recordedAudio={recordedAudio}
                            maxDuration={60}
                          />
                        </>
                      )}

                      {/* Loading State */}
                      {submitting && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%)",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="primary"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            🔍 Analyzing your pronunciation...
                          </Typography>
                          <LinearProgress
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              background: "rgba(0, 82, 212, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                background:
                                  "linear-gradient(90deg, #0052D4 0%, #00C9FF 100%)",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Assessment Results */}
                {assessment && (
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 4 }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: "success.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            boxShadow: (theme) => theme.shadows[3],
                          }}
                        >
                          <Assessment sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Assessment Results
                        </Typography>
                      </Box>

                      {/* Score Display */}
                      <Box
                        sx={{
                          mb: 3,
                          p: 3,
                          borderRadius: 2,
                          background: getScoreGradient(assessment.total_score),
                          textAlign: "center",
                          color: "white",
                          boxShadow: `0px 4px 16px ${assessment.total_score >= 90
                            ? "rgba(16, 185, 129, 0.3)"
                            : assessment.total_score >= 70
                              ? "rgba(245, 158, 11, 0.3)"
                              : "rgba(239, 68, 68, 0.3)"
                            }`,
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 700,
                            fontSize: "2.5rem",
                            mb: 0.5,
                            position: "relative",
                            textShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          {assessment.total_score}/100
                        </Typography>
                        <Box sx={{ mt: 2, position: "relative" }}>
                          <LinearProgress
                            variant="determinate"
                            value={assessment.total_score}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              background: "rgba(255, 255, 255, 0.3)",
                              "& .MuiLinearProgress-bar": {
                                background: "white",
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 1.5,
                            position: "relative",
                            fontWeight: 600,
                          }}
                        >
                          {assessment.total_score >= 90
                            ? "Excellent!"
                            : assessment.total_score >= 70
                              ? "Good Job!"
                              : "Keep Practicing!"}
                        </Typography>
                      </Box>

                      {/* AI Feedback */}
                      {assessment.overall_feedback && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            mb: 3,
                            bgcolor: "#F8FAFC",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EditNote sx={{ fontSize: 20 }} />
                            AI Feedback
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {assessment.overall_feedback}
                          </Typography>
                        </Paper>
                      )}

                      {/* Highlighted Sentence */}
                      <Box sx={{ mb: 4, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Pronunciation Analysis
                        </Typography>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {selectedInstruction.text.split(" ").map((word, index) => {
                            const error = assessment.errors?.find(
                              (e) => e.word_index === index ||
                                e.word?.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") ===
                                word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
                            );

                            if (error) {
                              return (
                                <Tooltip key={index} title={error.message} arrow>
                                  <Box
                                    component="span"
                                    sx={{
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      bgcolor: error.severity === "severe" ? "error.light" : "warning.light",
                                      color: error.severity === "severe" ? "error.contrastText" : "warning.contrastText",
                                      fontWeight: 700,
                                      cursor: "help",
                                      borderBottom: "2px solid",
                                      borderColor: error.severity === "severe" ? "error.main" : "warning.main",
                                    }}
                                  >
                                    {word}
                                  </Box>
                                </Tooltip>
                              );
                            }

                            return (
                              <Typography
                                key={index}
                                variant="h5"
                                component="span"
                                sx={{ px: 0.5, fontWeight: 500 }}
                              >
                                {word}
                              </Typography>
                            );
                          })}
                        </Box>
                      </Box>

                      {/* Errors */}
                      {assessment.errors && assessment.errors.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: 600, mb: 2 }}
                          >
                            Issues Found ({assessment.errors.length})
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {assessment.errors.map((error, index) => (
                              <Alert
                                key={index}
                                severity={getSeverityColor(error.severity)}
                                sx={{ borderRadius: 2 }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{ mb: 0.5 }}
                                >
                                  {error.error_type
                                    ?.replace(/_/g, " ")
                                    .toUpperCase()}
                                </Typography>
                                {error.message && (
                                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    {error.message}
                                  </Typography>
                                )}
                                <Typography variant="body2">
                                  <strong>Word:</strong> "{error.word}"
                                </Typography>
                              </Alert>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Actions */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleTryAgain}
                          startIcon={<Mic />}
                          size="large"
                          sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: "1rem",
                            fontWeight: 700,
                            background: (theme) =>
                              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                            boxShadow: (theme) => theme.shadows[6],
                            borderRadius: 3,
                            textTransform: "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: (theme) => theme.shadows[10],
                              background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            },
                          }}
                        >
                          Practice Again
                        </Button>

                      </Box>

                      {/* Recommendations */}
                      {recommendations.length > 0 && (
                        <Box sx={{ mt: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                              }}
                            >
                              <Psychology sx={{ color: "white", fontSize: 22 }} />
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                Recommended for You
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Based on your pronunciation history
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {recommendations.map((rec, idx) => (
                              <Paper
                                key={rec.instruction_id}
                                elevation={0}
                                sx={{
                                  p: 2.5,
                                  borderRadius: 2.5,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  bgcolor: "rgba(99, 102, 241, 0.02)",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  "&:hover": {
                                    bgcolor: "rgba(99, 102, 241, 0.05)",
                                    borderColor: "primary.light",
                                    transform: "translateX(8px)",
                                  }
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Chip
                                      label={`#${rec.instruction_number || '?'}`}
                                      size="small"
                                      sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                        height: 22
                                      }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                      {rec.reason}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.4 }}>
                                    "{rec.text}"
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  endIcon={<ArrowForward />}
                                  onClick={() => {
                                    const inst = instructions.find(i => i.id === rec.instruction_id);
                                    if (inst) handleSelectInstruction(inst);
                                    else {
                                      // If instruction not in current list (already filtered), we would need a separate fetch or just use what we have
                                      handleSelectInstruction({
                                        id: rec.instruction_id,
                                        text: rec.text,
                                        group_id: rec.group_id
                                      });
                                    }
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    boxShadow: "0 4px 12px rgba(0, 82, 212, 0.2)"
                                  }}
                                >
                                  Practice
                                </Button>
                              </Paper>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Container>
        </Box >
      </Box >

      <Footer />
    </Container >
  );
}
