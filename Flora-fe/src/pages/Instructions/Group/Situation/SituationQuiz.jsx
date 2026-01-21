import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  LinearProgress,
  CircularProgress,
  Chip,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Timer,
  Assessment,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { situationService } from "~/services/situationService";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/AppBar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";
import {
  containerVariants,
  itemVariants,
  scalePopVariants,
  slideUpVariants,
  modalVariants,
  backdropVariants,
  hoverScale,
  tapScale
} from "~/utils/animations";
function SituationQuiz() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});

  const startQuiz = useCallback(async () => {
    try {
      const response = await situationService.startQuiz(groupId);
      if (response.success) {
        setQuiz(response.data);
        setAnswers({});
        setCurrentQuestion(0);
        setQuestionTimes({});
      }
    } catch {
      showNotification("Failed to start quiz", "error");
    } finally {
      setLoading(false);
    }
  }, [groupId, showNotification]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  useEffect(() => {
    // Track time when question changes
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswerChange = (questionNumber, choiceId) => {
    setAnswers({
      ...answers,
      [questionNumber]: choiceId,
    });
  };

  const handleNext = () => {
    // Save time spent on current question
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setQuestionTimes({
      ...questionTimes,
      [currentQuestion]: timeSpent,
    });

    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    const answerList = quiz.questions.map((q, idx) => ({
      situation_id: q.situation_id,
      selected_choice_id: answers[idx + 1] || "A",
      time_spent_seconds: questionTimes[idx] || 30,
    }));

    setSubmitting(true);
    try {
      const response = await situationService.submitQuiz(
        quiz.quiz_id,
        answerList
      );
      if (response.success) {
        setResults(response.data);
        showNotification(`Score: ${response.data.percentage}%`, "success");
      }
    } catch {
      showNotification("Failed to submit quiz", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExitConfirm = () => {
    navigate(`/group/${groupId}`);
  };

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
        <CircularProgress />
      </Box>
    );
  }

  if (results) {
    return (
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Appbar
          showBack={false}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <Box
          sx={{
            display: "flex",
            flex: 1,
            height: (theme) => theme.flora.contentHeight,
            bgcolor: "background.default",
            overflow: "hidden",
          }}
        >
          <Sidebar collapsed={sidebarCollapsed} />

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
            <Container maxWidth="md">
              {/* Results Summary */}
              <Card
                component={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                elevation={0}
                sx={{
                  mb: 4,
                  textAlign: "center",
                  py: 4,
                  border: "none",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #0052D4 0%, #00C9FF 100%)",
                  color: "white",
                  boxShadow: "0 10px 40px -10px rgba(0, 82, 212, 0.5)",
                }}
              >
                <Typography variant="h2" fontWeight="700" gutterBottom>
                  {results.percentage}%
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {results.total_score}/{results.max_score} points
                </Typography>
                <Box
                  sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}
                >
                  <Chip
                    label={`${results.perfect_count} Perfect`}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                  />
                  <Chip
                    label={`${results.acceptable_count} Acceptable`}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                  />
                  <Chip
                    label={`${results.poor_count} Poor`}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                  />
                </Box>
              </Card>

              {/* Detailed Results */}
              {results.results?.map((result, idx) => (
                <Card
                  key={idx}
                  component={motion.div}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    overflow: "hidden"
                  }}
                  elevation={0}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                      <Chip
                        label={`Q${result.question_number}`}
                        sx={{
                          fontWeight: 700,
                          bgcolor: result.is_best_choice ? 'success.light' : 'warning.light',
                          color: result.is_best_choice ? 'success.dark' : 'warning.dark',
                          borderRadius: 1,
                          height: 24,
                          mt: 0.5
                        }}
                      />
                      <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.4 }}>
                        {result.question}
                      </Typography>
                    </Box>

                    <Alert
                      severity={result.is_best_choice ? "success" : "warning"}
                      variant="outlined"
                      sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: result.is_best_choice ? 'success.main' : 'warning.main' }}
                    >
                      <Typography variant="subtitle2" fontWeight="700" gutterBottom>Your answer:</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {result.selected_choice_text}
                      </Typography>
                    </Alert>

                    {!result.is_best_choice && result.best_choice && (
                      <Alert severity="info" variant="filled" sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(2, 136, 209, 0.2)' }}>
                        <Typography variant="subtitle2" fontWeight="700" gutterBottom>Better choice:</Typography>
                        <Typography variant="body1" fontWeight="500">
                          {result.best_choice.text}
                        </Typography>
                      </Alert>
                    )}

                    {/* Detailed Explanation */}
                    {result.detailed_explanation && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px dashed',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="subtitle2" color="primary.main" fontWeight="700" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                          Explanation
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {result.detailed_explanation}
                        </Typography>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate(`/group/${groupId}`)}
                sx={{ mt: 3 }}
              >
                Back to Group
              </Button>
            </Container>
          </Box>
        </Box>
      </Container>
    );
  }

  const question = quiz?.questions[currentQuestion];
  const isAnswered = !!answers[currentQuestion + 1];
  const totalQuestions = quiz?.questions.length || 0;

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Appbar
        showBack={false}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: (theme) => theme.flora.contentHeight,
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Sidebar collapsed={sidebarCollapsed} />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            py: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              {/* Left Sidebar - Progress Monitor */}
              <Paper
                elevation={0}
                sx={{
                  width: 280,
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "fit-content",
                  position: "sticky",
                  top: 20,
                }}
              >
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Progress Monitor
                </Typography>

                {/* Question Status Grid */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Questions Status
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                      const isCurrent = idx === currentQuestion;
                      const isAnsweredQ = !!answers[idx + 1];

                      return (
                        <Box
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isCurrent
                              ? "primary.main"
                              : isAnsweredQ
                                ? "success.light"
                                : "action.hover",
                            color:
                              isCurrent || isAnsweredQ
                                ? "white"
                                : "text.secondary",
                            fontWeight: 600,
                            border: "2px solid",
                            borderColor: isCurrent
                              ? "primary.main"
                              : "transparent",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.1)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          {isAnsweredQ && !isCurrent ? (
                            <CheckCircle fontSize="small" />
                          ) : (
                            idx + 1
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Stats */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Answered
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {Object.keys(answers).length}/{totalQuestions}
                    </Typography>
                  </Box>
                </Box>

                {/* Exit Button */}
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setExitDialogOpen(true)}
                  sx={{ mt: 3 }}
                >
                  Exit Quiz
                </Button>
              </Paper>

              {/* Main Content - Question */}
              <Box sx={{ flex: 1 }}>
                {question && (
                  <Card
                    component={motion.div}
                    key={currentQuestion}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    elevation={0}
                    sx={{
                      border: "none",
                      boxShadow: "0 8px 32px rgba(0, 82, 212, 0.08)",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 3 }}>
                        <Chip
                          label={`Question ${currentQuestion + 1} of ${totalQuestions}`}
                          color="primary"
                          sx={{ mb: 2, fontWeight: 600 }}
                        />
                        <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                          {question.question}
                        </Typography>
                      </Box>

                      <RadioGroup
                        value={answers[currentQuestion + 1] || ""}
                        onChange={(e) =>
                          handleAnswerChange(
                            currentQuestion + 1,
                            e.target.value
                          )
                        }
                      >
                        {question.choices.map((choice) => (
                          <Paper
                            key={choice.choice_id}
                            elevation={0}
                            sx={{
                              mb: 2,
                              border: "2px solid",
                              borderColor:
                                answers[currentQuestion + 1] ===
                                  choice.choice_id
                                  ? "primary.main"
                                  : "transparent",
                              borderRadius: 3,
                              bgcolor:
                                answers[currentQuestion + 1] === choice.choice_id
                                  ? "rgba(0, 82, 212, 0.04)"
                                  : "white",
                              boxShadow:
                                answers[currentQuestion + 1] === choice.choice_id
                                  ? "0 4px 12px rgba(0, 82, 212, 0.15)"
                                  : "0 2px 8px rgba(0,0,0,0.04)",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                borderColor: "primary.main",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                              },
                            }}
                          >
                            <FormControlLabel
                              value={choice.choice_id}
                              control={<Radio />}
                              label={
                                <Typography variant="body1" sx={{ py: 1 }}>
                                  {choice.text}
                                </Typography>
                              }
                              sx={{
                                width: "100%",
                                m: 0,
                                px: 2,
                                py: 1,
                              }}
                            />
                          </Paper>
                        ))}
                      </RadioGroup>

                      {/* Navigation Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 4,
                          gap: 2,
                        }}
                      >
                        {currentQuestion < totalQuestions - 1 ? (
                          <Button
                            variant="contained"
                            size="large"
                            onClick={handleNext}
                            disabled={!isAnswered}
                          >
                            Next Question
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={
                              submitting ||
                              Object.keys(answers).length < totalQuestions
                            }
                          >
                            {submitting ? "Submitting..." : "Submit"}
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
        <DialogTitle>Exit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit? Your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExitConfirm} color="error" variant="contained">
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Container>
  );
}

export default SituationQuiz;
