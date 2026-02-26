import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Mic, Stop, PlayArrow, Send } from "@mui/icons-material";

export default function AudioRecorder({
  onRecordingComplete,
  onRecordingReady,
  onSubmit,
  recordedAudio,
  maxDuration = 30,
  autoStart = false,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);

        // Call onRecordingReady callback (not onRecordingComplete)
        // This allows parent to show playback UI before submitting
        if (onRecordingReady) {
          onRecordingReady(blob);
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError("");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access.");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Auto-start recording if autoStart prop is true
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ textAlign: "center" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!audioURL && (
        <Box>
          <Button
            variant="contained"
            size="large"
            startIcon={isRecording ? <Stop /> : <Mic />}
            onClick={isRecording ? stopRecording : startRecording}
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
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>

          {isRecording && (
            <Box sx={{ mt: 2 }}>
              <CircularProgress
                size={20}
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              <Typography variant="body2" component="span">
                Recording: {recordingTime}s / {maxDuration}s
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {audioURL && (
        <Box>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "success.light",
              "& .MuiAlert-icon": {
                fontSize: 28,
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ✓ Recording complete! Duration: {recordingTime}s
            </Typography>
          </Alert>

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
              size="large"
              startIcon={<PlayArrow />}
              onClick={playRecording}
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
              Play Recording
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Mic />}
              onClick={() => {
                setAudioURL(null);
                setAudioBlob(null);
                setRecordingTime(0);
                // Immediately start new recording
                startRecording();
              }}
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
              Re-record
            </Button>
            {recordedAudio && onSubmit && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                onClick={onSubmit}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                  boxShadow: (theme) => theme.shadows[6],
                  borderRadius: 3,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) => theme.shadows[10],
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                  },
                }}
              >
                Submit for Analysis
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
