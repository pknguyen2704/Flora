import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    LinearProgress,
    Tooltip,
    Alert
} from "@mui/material";
import { Mic, VolumeUp, EditNote, Assessment } from "@mui/icons-material";
import AudioRecorder from "~/components/shared/AudioRecorder";
import { pronunciationService } from "~/services/pronunciationService";

export default function Pronunciation({ text }) {
    const [showRecorder, setShowRecorder] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [assessment, setAssessment] = useState(null);
    const [sessionId] = useState(`session_${Date.now()}`);

    const handleStartRecording = () => {
        setShowRecorder(true);
        setRecordedAudio(null);
        setAssessment(null);
    };

    const handleRecordingReady = (audioBlob) => {
        setRecordedAudio(audioBlob);
    };

    const handleListenText = () => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmitRecording = async () => {
        if (!recordedAudio || !text) return;

        setSubmitting(true);
        try {
            const audioFile = new File([recordedAudio], "recording.wav", {
                type: "audio/wav",
            });

            // Since this is arbitrary quiz text, we pass null for instructionId and the text for customText
            const response = await pronunciationService.assessPronunciation(
                audioFile,
                null,
                text,
                sessionId
            );

            if (response.success) {
                setAssessment(response.data.assessment);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
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
        <Box sx={{ width: "100%", mt: 4 }}>
            {!assessment && (
                <Card
                    sx={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 8px 32px rgba(0, 82, 212, 0.08)",
                    }}
                >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        {!showRecorder && (
                            <>
                                <Box sx={{ textAlign: "center", mb: 3 }}>
                                    <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                                        Practice Pronunciation
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Listen to the correct answer and practice speaking it.
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
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
                                            background: (theme) => `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                                            boxShadow: (theme) => theme.shadows[4],
                                            borderRadius: 3,
                                            textTransform: "none",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                background: (theme) => `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
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
                                            background: (theme) => `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                                            boxShadow: (theme) => theme.shadows[4],
                                            borderRadius: 3,
                                            textTransform: "none",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                background: (theme) => `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                                            },
                                        }}
                                    >
                                        Start Recording
                                    </Button>
                                </Box>
                            </>
                        )}

                        {showRecorder && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            background: (theme) => `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
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
                                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        color: "white",
                                        boxShadow: (theme) => theme.shadows[4],
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.6, fontStyle: "italic" }}>
                                        "{text}"
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

                        {submitting && (
                            <Box sx={{ mt: 3, p: 3, borderRadius: 2, background: "linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%)" }}>
                                <Typography variant="body1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                                    🔍 Analyzing your pronunciation...
                                </Typography>
                                <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Assessment Results */}
            {assessment && (
                <Card sx={{ background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "success.main", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                                <Assessment sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Assessment Results
                            </Typography>
                        </Box>

                        {/* Score Display */}
                        <Box sx={{
                            mb: 3, p: 3, borderRadius: 2, background: getScoreGradient(assessment.total_score),
                            textAlign: "center", color: "white"
                        }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: "2.5rem", mb: 0.5 }}>
                                {assessment.total_score}/100
                            </Typography>
                            <Box sx={{ mt: 2 }}><LinearProgress variant="determinate" value={assessment.total_score} sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { bgcolor: "white" } }} /></Box>
                            <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 600 }}>
                                {assessment.total_score >= 90 ? "Excellent!" : assessment.total_score >= 70 ? "Good Job!" : "Keep Practicing!"}
                            </Typography>
                        </Box>

                        {/* AI Feedback */}
                        {assessment.overall_feedback && (
                            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                    <EditNote sx={{ fontSize: 20 }} /> AI Feedback
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>{assessment.overall_feedback}</Typography>
                            </Paper>
                        )}

                        {/* Highlighted Sentence */}
                        <Box sx={{ mb: 4, textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Pronunciation Analysis</Typography>
                            <Box sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
                                {text.split(" ").map((word, index) => {
                                    const error = assessment.errors?.find(e =>
                                        e.word_index === index ||
                                        e.word?.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") === word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
                                    );

                                    if (error) {
                                        return (
                                            <Tooltip key={index} title={error.message} arrow>
                                                <Box component="span" sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: error.severity === "severe" ? "error.light" : "warning.light", color: error.severity === "severe" ? "error.contrastText" : "warning.contrastText", fontWeight: 700, cursor: "help", borderBottom: "2px solid", borderColor: error.severity === "severe" ? "error.main" : "warning.main" }}>
                                                    {word}
                                                </Box>
                                            </Tooltip>
                                        );
                                    }

                                    return <Typography key={index} variant="h5" component="span" sx={{ px: 0.5, fontWeight: 500 }}>{word}</Typography>;
                                })}
                            </Box>
                        </Box>

                        {/* Errors */}
                        {assessment.errors && assessment.errors.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>Issues Found ({assessment.errors.length})</Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {assessment.errors.map((error, index) => (
                                        <Alert key={index} severity={getSeverityColor(error.severity)} sx={{ borderRadius: 2 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>{error.error_type?.replace(/_/g, " ").toUpperCase()}</Typography>
                                            {error.message && <Typography variant="body2" sx={{ mb: 0.5 }}>{error.message}</Typography>}
                                            <Typography variant="body2"><strong>Word:</strong> "{error.word}"</Typography>
                                        </Alert>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button variant="outlined" startIcon={<Mic />} onClick={handleTryAgain} sx={{ borderRadius: 2, py: 1, px: 3, fontWeight: 600 }}>Try Again</Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
