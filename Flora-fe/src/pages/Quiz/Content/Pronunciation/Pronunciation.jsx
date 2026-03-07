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

import {
  Mic,
  VolumeUp,
  Assessment
} from "@mui/icons-material";

import AudioRecorder from "~/components/shared/AudioRecorder";
import { pronunciationService } from "~/services/pronunciationService";
import PhonemeTimeline from "~/components/PhonemeTimeline/PhonemeTimeline";


/* ------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------ */

const scoreColor = (score) => {
  if (score >= 85) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
};

const scoreGradient = (score) => {
  if (score >= 9) return "linear-gradient(135deg,#10B981,#34D399)";
  if (score >= 7) return "linear-gradient(135deg,#F59E0B,#FBBF24)";
  return "linear-gradient(135deg,#EF4444,#F87171)";
};


/* ------------------------------------------------ */
/* Word Card */
/* ------------------------------------------------ */

function WordCard({ word }) {

  return (

    <Box sx={{ textAlign: "center", minWidth: 130 }}>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider"
        }}
      >

        <Typography fontWeight={700}>
          {word.word}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: scoreColor(word.score),
            fontWeight: 700
          }}
        >
          {word.score}%
        </Typography>

      </Paper>

      {word.phones && (

        <PhonemeTimeline phones={word.phones} />

      )}

      {word.issues?.length > 0 && (

        <Box sx={{ mt: 1 }}>

          {word.issues.map((i, idx) => (
            <Typography
              key={idx}
              variant="caption"
              color="error.main"
              display="block"
            >
              {i}
            </Typography>
          ))}

        </Box>

      )}

    </Box>

  );

}


/* ------------------------------------------------ */
/* Main Component */
/* ------------------------------------------------ */

export default function Pronunciation({ text }) {

  const [showRecorder, setShowRecorder] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const [sessionId] = useState(`session_${Date.now()}`);


  /* ---------------------------------------- */
  /* Listen example */
  /* ---------------------------------------- */

  const listenText = () => {

    if (!text) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";

    window.speechSynthesis.speak(u);

  };


  /* ---------------------------------------- */
  /* Recording */
  /* ---------------------------------------- */

  const startRecording = () => {

    setShowRecorder(true);
    setAssessment(null);
    setRecordedAudio(null);

  };

  const onRecordingReady = (blob) => {

    setRecordedAudio(blob);

  };


  /* ---------------------------------------- */
  /* Submit */
  /* ---------------------------------------- */

  const submitRecording = async () => {

    if (!recordedAudio) return;

    setSubmitting(true);
    setProgress(0);

    const timer = setInterval(() => {

      setProgress(p => {
        if (p > 90) return 90

        if (p < 25) setProgressMessage("Uploading audio...")
        else if (p < 50) setProgressMessage("Transcribing speech...")
        else if (p < 75) setProgressMessage("Aligning phonemes...")
        else setProgressMessage("Analyzing pronunciation...")

        return p + Math.random() * 5
      })

    }, 300)

    try {

      const file = new File([recordedAudio], "recording.wav", { type: "audio/wav" })

      const res = await pronunciationService.assessPronunciation(
        file,
        null,
        text,
        sessionId
      )

      clearInterval(timer)

      if (res.success) {

        setProgress(100)

        setTimeout(() => {
          setAssessment(res.data.assessment)
          setSubmitting(false)
        }, 400)

      }

    } catch (err) {

      console.error(err)
      clearInterval(timer)
      setSubmitting(false)

    }

  }


  /* ---------------------------------------- */
  /* Reset */
  /* ---------------------------------------- */

  const retry = () => {

    setShowRecorder(false)
    setAssessment(null)
    setRecordedAudio(null)

  }


  /* ------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------ */

  return (

    <Box sx={{ width: "100%", mt: 4 }}>


      {/* ------------------------------------------------ */}
      {/* PRACTICE CARD */}
      {/* ------------------------------------------------ */}

      {!assessment && (

        <Card
          elevation={0}
          sx={{
            border: "1px dashed",
            borderColor: "primary.light",
            borderRadius: 2
          }}
        >

          <CardContent sx={{ textAlign: "center", p: 4 }}>

            {!showRecorder && (

              <>
                <Typography variant="h6" fontWeight={700}>
                  Practice Pronunciation
                </Typography>

                <Typography sx={{ mb: 3 }}>
                  Listen and repeat the sentence.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>

                  <Button
                    variant="contained"
                    startIcon={<VolumeUp />}
                    onClick={listenText}
                  >
                    Listen
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Mic />}
                    color="error"
                    onClick={startRecording}
                  >
                    Record
                  </Button>

                </Box>
              </>
            )}

            {showRecorder && (

              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recording
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    background: "linear-gradient(135deg,#6366F1,#9333EA)",
                    color: "white"
                  }}
                >

                  <Typography fontStyle="italic">
                    "{text}"
                  </Typography>

                </Paper>

                <AudioRecorder
                  onRecordingReady={onRecordingReady}
                  onSubmit={submitRecording}
                  recordedAudio={recordedAudio}
                />

              </>
            )}

            {submitting && (

              <Box sx={{ mt: 3 }}>

                <Typography>
                  {progressMessage}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 1 }}
                />

              </Box>

            )}

          </CardContent>
        </Card>

      )}


      {/* ------------------------------------------------ */}
      {/* RESULTS */}
      {/* ------------------------------------------------ */}

      {assessment && (
        <Box sx={{ mt: 3, animation: "fadeIn 0.5s ease-out" }}>
          {/* Summary Header - Quiz Style */}
          <Card
            elevation={0}
            sx={{
              mb: 4,
              textAlign: "center",
              py: 4,
              borderRadius: 3,
              background: assessment.total_score >= 80
                ? "linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                : assessment.total_score >= 60
                  ? "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)"
                  : "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
              color: "white",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
          >
            <Typography variant="h2" fontWeight="800" gutterBottom>
              {Math.round(assessment.total_score / 10)}/10
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>
              {assessment.words.filter(w => w.score >= 85).length}/{assessment.words.length} Words Correct
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}>
              <Chip
                label={assessment.total_score >= 85 ? "Excellent!" : assessment.total_score >= 60 ? "Good Effort" : "Keep Practicing"}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700 }}
              />
            </Box>
          </Card>

          {/* Word Details */}
          <Typography variant="h6" fontWeight="800" sx={{ mb: 2, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
            <Assessment sx={{ color: "primary.main" }} /> Detailed Word Analysis
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 4 }}>
            {assessment.words.map((w, i) => {
              const isCorrect = w.score >= 85;
              const color = scoreColor(w.score);

              return (
                <Box key={i} sx={{ textAlign: "center", width: { xs: '100%', sm: 'calc(50% - 16px)', md: 160 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: "2px solid",
                      borderColor: isCorrect ? "success.light" : w.score >= 60 ? "warning.light" : "error.light",
                      bgcolor: isCorrect ? "rgba(16, 185, 129, 0.03)" : w.score >= 60 ? "rgba(245, 158, 11, 0.03)" : "rgba(239, 68, 68, 0.03)",
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'transform 0.2s',
                      "&:hover": { transform: 'translateY(-4px)' }
                    }}
                  >
                    {/* Status Icon */}
                    <Box sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: isCorrect ? "success.main" : w.score >= 60 ? "warning.main" : "error.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      zIndex: 1
                    }}>
                      {isCorrect ? <CheckCircle sx={{ fontSize: 18 }} /> : <Typography variant="caption" fontWeight="900">!</Typography>}
                    </Box>

                    <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 0.5 }}>
                      {w.word}
                    </Typography>

                    <Typography variant="h5" fontWeight="900" sx={{ color: color }}>
                      {Math.round(w.score / 10)} pts
                    </Typography>

                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                      Accuracy: {w.score}%
                    </Typography>

                    {w.phones && <Box sx={{ mt: 1.5 }}><PhonemeTimeline phones={w.phones} /></Box>}

                    {w.issues?.length > 0 && (
                      <Box sx={{ mt: 1.5, textAlign: 'left' }}>
                        {w.issues.map((msg, idx) => (
                          <Typography key={idx} variant="caption" color="error.main" sx={{ display: 'block', fontSize: '0.65rem', lineHeight: 1.2, mb: 0.5, fontWeight: 600 }}>
                            • {msg}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
            <Button
              startIcon={<Mic />}
              onClick={retry}
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}
            >
              Try Again
            </Button>
            <Button
              startIcon={<VolumeUp />}
              onClick={listenText}
              variant="outlined"
              size="large"
              sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}
            >
              Listen Again
            </Button>
          </Box>
        </Box>
      )}


    </Box>

  )

}