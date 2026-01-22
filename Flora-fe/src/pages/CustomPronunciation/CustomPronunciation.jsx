import React, { useState } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  LinearProgress,
  Paper,
  Divider,
} from "@mui/material";
import {
  Mic,
  Stop,
  VolumeUp,
  Assessment,
  EditNote,
  RecordVoiceOver,
  Error,
  Search,
  Star,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import AudioRecorder from "~/components/shared/AudioRecorder";
import { pronunciationService } from "~/services/pronunciationService";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/Appbar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";
import ChatIcon from "@mui/icons-material/Chat";
import {
  containerVariants,
  itemVariants,
  slideUpVariants,
  scalePopVariants,
  hoverScale,
  tapScale
} from "~/utils/animations";

export default function CustomPronunciation() {
  const { showNotification } = useNotification();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  const [customText, setCustomText] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleTextChange = (e) => {
    setCustomText(e.target.value);
    setAssessment(null); // Clear previous assessment
    setShowRecorder(false); // Hide recorder when text changes
  };

  const handleStartRecording = () => {
    setShowRecorder(true);
    setRecordedAudio(null); // Clear previous recording
    setAssessment(null); // Clear previous assessment
  };

  // Called when recording is ready for playback (not submitted yet)
  const handleRecordingReady = (audioBlob) => {
    setRecordedAudio(audioBlob);
  };

  // Text-to-speech function to listen to the text
  const handleListenText = () => {
    if (!customText.trim()) {
      showNotification("Please enter text first", "warning");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(customText);
    utterance.lang = "en-US";
    utterance.rate = 1.0; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Called when user clicks "Submit for Analysis"
  const handleSubmitRecording = async () => {
    if (!customText.trim() || !recordedAudio) {
      showNotification("Please record audio first", "warning");
      return;
    }

    setLoading(true);

    try {
      // Convert blob to File object with proper filename and MIME type
      const audioFile = new File([recordedAudio], "recording.wav", {
        type: "audio/wav",
      });

      const sessionId = `custom_${Date.now()}`;

      // Call service with individual parameters (it creates FormData internally)
      const response = await pronunciationService.assessPronunciation(
        audioFile,
        null, // instructionId
        customText,
        sessionId
      );

      if (response.success) {
        setAssessment(response.data.assessment);
      }
    } catch (error) {
      console.error("Assessment error:", error);

      // Handle validation errors (422)
      let errorMessage = "Assessment failed";

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        // If detail is an array of validation errors
        if (Array.isArray(detail)) {
          errorMessage = detail
            .map((err) => err.msg || JSON.stringify(err))
            .join(", ");
        }
        // If detail is a string
        else if (typeof detail === "string") {
          errorMessage = detail;
        }
        // If detail is an object
        else {
          errorMessage = JSON.stringify(detail);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
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
            pt: { xs: 4, sm: 6, md: 8 },
            pb: { xs: 4, sm: 6, md: 8 },
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
            {/* Page Header with Animation */}
            <Box
              component={motion.div}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              sx={{
                mb: 6,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h3"
                fontWeight="700"
                sx={{
                  mb: 2,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Custom Instructions Pronunciation Practice
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Practice any instructions and get instant AI-powered feedback
              </Typography>
            </Box>

            {/* Instructions Banner */}
            <Box
              component={motion.div}
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              sx={{
                mb: 4,
                p: 4,
                borderRadius: 2, // 32px
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                color: "white",
                // boxShadow: (theme) => theme.shadows[4], // Use default
                maxWidth: "900px",
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                How it works
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.95, lineHeight: 1.6 }}
              >
                Enter any instruction you want to practice, then record yourself
                speaking it. Our AI will analyze your pronunciation and provide
                detailed feedback!
              </Typography>
            </Box>

            {/* Combined Text Input and Recording Card */}
            <AnimatePresence mode="wait">
              {!assessment && (
                <Card
                  component={motion.div}
                  variants={scalePopVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={hoverScale}
                  elevation={0}
                  sx={{
                    mb: 4,
                    // borderRadius: 4, // Use theme
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    maxWidth: "900px",
                    width: "100%",
                    "&:hover": {
                      borderColor: "primary.main",
                      // boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    {/* Text Input Section */}
                    {!showRecorder && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                            gap: 1,
                          }}
                        >
                          <ChatIcon sx={{ fontSize: 24 }} />
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            Enter Your Text
                          </Typography>
                        </Box>

                        <TextField
                          fullWidth
                          rows={5}
                          placeholder="Type or paste the text you want to practice..."
                          value={customText}
                          onChange={handleTextChange}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              fontSize: "1.1rem",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0px 4px 12px rgba(0, 82, 212, 0.1)",
                              },
                              "&.Mui-focused": {
                                boxShadow: "0px 4px 16px rgba(0, 82, 212, 0.2)",
                              },
                            },
                          }}
                          helperText={
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "4px",
                              }}
                            >
                              <span>{customText.length} characters</span>
                              {customText.length > 0 && (
                                <span style={{ color: "#10B981" }}>
                                  ✓ Ready to record
                                </span>
                              )}
                            </span>
                          }
                        />

                        {/* Quick Examples */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Quick examples:
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}
                          >
                            {[
                              "Hello, how are you today?",
                              "Sit down, please",
                              "Open the door, please",
                            ].map((example, index) => (
                              <Chip
                                key={index}
                                label={example}
                                onClick={() => setCustomText(example)}
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                  py: 2.5,
                                  px: 1,
                                  background:
                                    "linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%)",
                                  border: "1px solid #E2E8F0",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)",
                                    color: "white",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0px 4px 12px rgba(0, 82, 212, 0.25)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Listen and Start Recording Buttons */}
                        {customText.trim() && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 3,
                              justifyContent: "center",
                              mt: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {/* Listen Button */}
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

                            {/* Start Recording Button */}
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
                        )}
                      </>
                    )}

                    {/* Recording Section - Only shown after clicking Start Recording and before assessment */}
                    {showRecorder && !assessment && (
                      <>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: "error.main",
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
                              position: "relative",
                              fontStyle: "italic",
                            }}
                          >
                            "{customText}"
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
                    {loading && (
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
                          <Search sx={{ fontSize: 20, mr: 1 }} />
                          Analyzing your pronunciation...
                        </Typography>
                        <LinearProgress
                          sx={{
                            height: 8,
                            borderRadius: 2,
                            bgcolor: "rgba(0, 82, 212, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "primary.main",
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
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    maxWidth: "900px",
                    width: "100%",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
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
                        background: `linear-gradient(135deg, ${assessment.total_score >= 90
                          ? "#10B981 0%, #34D399 100%"
                          : assessment.total_score >= 70
                            ? "#F59E0B 0%, #FBBF24 100%"
                            : "#EF4444 0%, #F87171 100%"
                          })`,
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
                      <Typography variant="h2" sx={{ fontSize: "2rem", mb: 0.5 }}>
                        Score
                      </Typography>
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
                        {assessment.total_score} / 100
                      </Typography>
                      <Box sx={{ mt: 2, position: "relative" }}>
                        <LinearProgress
                          variant="determinate"
                          value={assessment.total_score}
                          sx={{
                            height: 8,
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.3)",
                            "& .MuiLinearProgress-bar": {
                              background: "white",
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ mt: 1.5, position: "relative", fontWeight: 600 }}
                      >
                        {assessment.total_score >= 90
                          ? "Excellent!"
                          : assessment.total_score >= 70
                            ? "Good Job!"
                            : "Keep Practicing!"}
                      </Typography>
                    </Box>

                    {/* Overall Feedback */}
                    {assessment.overall_feedback && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          background: "#F8FAFC",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
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

                    {/* Errors Section */}
                    {assessment.errors && assessment.errors.length > 0 ? (
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 700,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "1rem",
                              fontWeight: 700,
                              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            {assessment.errors.length}
                          </Box>
                          Issues Found
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                          }}
                        >
                          {assessment.errors.map((error, index) => (
                            <Paper
                              key={index}
                              elevation={0}
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: `${getSeverityColor(error.severity)}.light`,
                                backgroundColor: (theme) =>
                                  error.severity === 'severe' ? '#FEF2F2' :
                                    error.severity === 'moderate' ? '#FFFBEB' : '#F0FDF4',
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                                },
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {/* Decorative side bar */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: 6,
                                  background: (theme) =>
                                    error.severity === 'severe' ? theme.palette.error.main :
                                      error.severity === 'moderate' ? theme.palette.warning.main : theme.palette.success.main,
                                }}
                              />

                              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="800"
                                    sx={{
                                      color: 'text.primary',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1
                                    }}
                                  >
                                    {error.error_type.replace(/_/g, " ").toUpperCase()}
                                    <Chip
                                      label={error.severity}
                                      size="small"
                                      color={getSeverityColor(error.severity)}
                                      variant="outlined"
                                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}
                                    />
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text.secondary",
                                      mt: 0.5,
                                    }}
                                  >
                                    {error.message}
                                  </Typography>
                                </Box>
                                <Error color={getSeverityColor(error.severity)} />
                              </Box>

                              <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>
                                      TARGET WORD
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600" color="primary.main">
                                      "{error.word}"
                                    </Typography>
                                  </Box>
                                </Grid>
                                {error.expected && (
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                      <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>
                                        EXPECTED
                                      </Typography>
                                      <Typography variant="body1" fontWeight="600" color="success.main">
                                        /{error.expected}/
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}
                                {error.actual && (
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                      <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>
                                        YOU SAID
                                      </Typography>
                                      <Typography variant="body1" fontWeight="600" color="error.main">
                                        /{error.actual}/
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          mb: 4,
                          p: 3,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                          border: "1px solid",
                          borderColor: "success.light",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <Star sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#065F46' }}>
                            Perfect Pronunciation!
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#047857' }}>
                            We didn't detect any errors in your speech. Great job!
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Try Again Button */}
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        startIcon={<Mic />}
                        onClick={() => setAssessment(null)}
                        size="large"
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: "1rem",
                          fontWeight: 700,
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                          boxShadow: (theme) => theme.shadows[6],
                          borderRadius: 2,
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
                        Try Again
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Container>
  );
}
