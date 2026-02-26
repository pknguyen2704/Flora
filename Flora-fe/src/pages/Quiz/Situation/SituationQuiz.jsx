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
    CircularProgress,
    Chip,
    Alert,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    CheckCircle,
    Psychology,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { quizService } from "~/services/quizService";
import { situationService } from "~/services/situationService";
import { useNotification } from "~/contexts/NotificationContext";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/Appbar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";

function SituationQuiz() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { collapsed: sidebarCollapsed, toggleSidebar, setCollapsed } = useSidebar();

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
            setLoading(true);
            let response;
            if (groupId === "global") {
                const queryParams = new URLSearchParams(window.location.search);
                const mode = queryParams.get("mode") || "random";

                if (mode === "full") {
                    response = await quizService.getAll();
                } else {
                    response = await quizService.getRandom(10);
                }

                if (response.success) {
                    const quizzes = response.data.quizzes;
                    setQuiz({
                        quiz_id: `global_${Date.now()}`,
                        questions: quizzes.map((q, idx) => ({
                            quiz_id: q.id,
                            question_number: idx + 1,
                            question: q.question,
                            choices: q.choices,
                            explanation: q.explanation,
                            principle: q.principle
                        }))
                    });
                    setAnswers({});
                    setCurrentQuestion(0);
                    setQuestionTimes({});
                }
            } else {
                response = await situationService.startQuiz(groupId);
                if (response.success) {
                    const situations = response.data.questions;
                    setQuiz({
                        quiz_id: response.data.quiz_id,
                        questions: situations.map(s => ({
                            ...s,
                            situation_id: s.situation_id
                        }))
                    });
                    setAnswers({});
                    setCurrentQuestion(0);
                    setQuestionTimes({});
                }
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to start quiz", "error");
        } finally {
            setLoading(false);
        }
    }, [groupId, showNotification]);

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    useEffect(() => {
        setStartTime(Date.now());
    }, [currentQuestion]);

    const handleAnswerChange = (questionNumber, choiceId) => {
        setAnswers({
            ...answers,
            [questionNumber]: choiceId,
        });
    };

    const handleNext = () => {
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
        const isGlobal = groupId === "global";
        const answerList = quiz.questions.map((q, idx) => ({
            quiz_id: q.quiz_id,
            situation_id: q.situation_id,
            selected_choice_id: answers[idx + 1] || "A",
            time_spent_seconds: questionTimes[idx] || 30,
        }));

        setSubmitting(true);
        try {
            const response = isGlobal
                ? await quizService.submit({ quiz_id: quiz.quiz_id, answers: answerList })
                : await situationService.submitQuiz(quiz.quiz_id, answerList);

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
        if (groupId === "global") {
            navigate('/quiz');
        } else {
            navigate(`/group/${groupId}`);
        }
    };

    const renderResults = () => (
        <Container maxWidth="md" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} elevation={0} sx={{
                mb: 4, textAlign: "center", py: 4, borderRadius: 2, background: "linear-gradient(135deg, #0052D4 0%, #00C9FF 100%)", color: "white", boxShadow: "0 10px 40px -10px rgba(0, 82, 212, 0.5)",
            }}>
                <Typography variant="h2" fontWeight="700" gutterBottom>{results.percentage}%</Typography>
                <Typography variant="h5" gutterBottom>{results.total_score}/{results.max_score} points</Typography>
                <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                    <Chip label={`${results.perfect_count} Perfect`} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
                    <Chip label={`${results.acceptable_count} Acceptable`} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
                    <Chip label={`${results.poor_count} Poor`} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
                </Box>
            </Card>

            {results.results?.map((result, idx) => {
                const rating = result.rating;
                const severity = rating === "best" ? "success" : rating === "acceptable" ? "warning" : "error";
                const isBest = rating === "best";

                return (
                    <Card key={idx} component={motion.div} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} sx={{
                        mb: 3, borderRadius: 2, border: "1px solid", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden"
                    }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                                <Chip label={`Question ${idx + 1}`} sx={{ fontWeight: 700, bgcolor: `${severity}.light`, color: `${severity}.dark`, borderRadius: 1, height: 24, mt: 0.5 }} />
                                <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.4 }}>{result.question}</Typography>
                            </Box>

                            <Alert severity={severity} variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: `${severity}.main`, bgcolor: `${severity}.light` }}>
                                <Typography variant="subtitle2" fontWeight="700" color={`${severity}.dark`} gutterBottom>Your answer:</Typography>
                                <Typography variant="body1" fontWeight="600" color={`${severity}.dark`}>{result.selected_choice_text}</Typography>
                            </Alert>

                            {!isBest && result.best_choice && (
                                <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="700" gutterBottom>Recommended best choice:</Typography>
                                    <Typography variant="body1" fontWeight="600">{result.best_choice.text}</Typography>
                                </Alert>
                            )}

                            {(result.detailed_explanation || result.explanation) && (
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" color="primary.main" fontWeight="700" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Why?</Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{result.detailed_explanation || result.explanation}</Typography>
                                </Paper>
                            )}

                            {result.principle && (
                                <Paper elevation={0} sx={{ p: 3, mt: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: 2, border: '1px solid rgba(255, 152, 0, 0.2)' }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <Psychology sx={{ color: 'warning.main', fontSize: 20 }} />
                                        <Typography variant="subtitle2" color="warning.main" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Core Principle</Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.primary" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>"{result.principle}"</Typography>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            <Button variant="contained" fullWidth size="large" onClick={handleExitConfirm} sx={{ mt: 3, py: 2, borderRadius: 2, fontWeight: 700 }}>
                {groupId === "global" ? "Finish Quiz" : "Back to Group"}
            </Button>
        </Container>
    );

    const renderQuiz = () => {
        const question = quiz?.questions[currentQuestion];
        const isAnswered = !!answers[currentQuestion + 1];
        const totalQuestions = quiz?.questions.length || 0;

        return (
            <Container maxWidth="lg" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "flex-start" }}>
                    {/* Progress Panel */}
                    <Paper elevation={0} sx={{ width: 280, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, position: "sticky", top: 20 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>Progress Monitor</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, mt: 2 }}>
                            {Array.from({ length: totalQuestions }).map((_, idx) => (
                                <Box key={idx} onClick={() => setCurrentQuestion(idx)} sx={{
                                    width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                                    bgcolor: idx === currentQuestion ? "primary.main" : !!answers[idx + 1] ? "success.light" : "action.hover",
                                    color: (idx === currentQuestion || !!answers[idx + 1]) ? "white" : "text.secondary",
                                    fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                                }}>
                                    {!!answers[idx + 1] && idx !== currentQuestion ? <CheckCircle fontSize="small" /> : idx + 1}
                                </Box>
                            ))}
                        </Box>
                        <Button variant="outlined" color="error" fullWidth onClick={() => setExitDialogOpen(true)} sx={{ mt: 3 }}>Exit Quiz</Button>
                    </Paper>

                    {/* Question Panel */}
                    <Box sx={{ flex: 1 }}>
                        {question && (
                            <Card sx={{ borderRadius: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Chip label={`Question ${currentQuestion + 1} of ${totalQuestions}`} color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                                    <Typography variant="h5" fontWeight="600" gutterBottom>{question.question}</Typography>
                                    <RadioGroup value={answers[currentQuestion + 1] || ""} onChange={(e) => handleAnswerChange(currentQuestion + 1, e.target.value)} sx={{ mt: 3 }}>
                                        {question.choices.map((choice) => (
                                            <Paper key={choice.choice_id} elevation={0} sx={{
                                                mb: 2, border: "2px solid", borderRadius: 2, transition: "all 0.2s",
                                                borderColor: answers[currentQuestion + 1] === choice.choice_id ? "primary.main" : "divider",
                                                "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" }
                                            }}>
                                                <FormControlLabel value={choice.choice_id} control={<Radio />} label={choice.text} sx={{ width: "100%", m: 0, px: 2, py: 1 }} />
                                            </Paper>
                                        ))}
                                    </RadioGroup>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                                        {currentQuestion < totalQuestions - 1 ? (
                                            <Button variant="contained" onClick={handleNext} disabled={!isAnswered}>Next Question</Button>
                                        ) : (
                                            <Button variant="contained" onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < totalQuestions}>
                                                {submitting ? "Submitting..." : "Submit Quiz"}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            </Container>
        );
    };

    return (
        <Container disableGutters maxWidth={false} sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default", overflow: "hidden" }}>
            <Appbar showBack={false} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
            <Box sx={{ display: "flex", flex: 1, bgcolor: "background.default", overflow: "hidden" }}>
                <Sidebar collapsed={sidebarCollapsed} />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto", py: { xs: 4, sm: 6, md: 8 } }}>
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <Box key="loading" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress />
                            </Box>
                        ) : results ? (
                            <Box key="results" sx={{ width: "100%" }}>
                                {renderResults()}
                            </Box>
                        ) : (
                            <Box key="quiz" sx={{ width: "100%" }}>
                                {renderQuiz()}
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>

            <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
                <DialogTitle>Exit Quiz?</DialogTitle>
                <DialogContent><Typography>Are you sure you want to exit? Your progress will be lost.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleExitConfirm} color="error" variant="contained">Exit</Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </Container>
    );
}

export default SituationQuiz;
