import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    Paper,
} from "@mui/material";
import {
    PlayArrow,
    Quiz as QuizIcon,
    Assignment,
    EmojiEvents,
    Mic as MicIcon,
    Shuffle,
    FormatListNumbered,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSidebar } from "~/contexts/SidebarContext";
import Appbar from "~/components/AppBar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";
import {
    containerVariants,
    itemVariants,
    hoverScale,
    tapScale
} from "~/utils/animations";

export default function Quiz() {
    const navigate = useNavigate();
    const { collapsed: sidebarCollapsed, toggleSidebar, setCollapsed } = useSidebar();


    const handleStartMode = (mode) => {
        // Navigate to the actual quiz runner with a mode parameter
        navigate(`/situations/quiz/global?mode=${mode}`);
    };

    return (
        <Container disableGutters maxWidth={false} sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Appbar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />

            <Box sx={{ display: "flex", flex: 1, bgcolor: "background.default", overflow: "hidden" }}>
                <Sidebar collapsed={sidebarCollapsed} />

                <Box sx={{ flex: 1, overflow: "auto", py: { xs: 4, md: 8 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Container maxWidth="lg">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <Box sx={{ textAlign: "center", mb: 6 }}>
                                <motion.div variants={itemVariants}>
                                    <Typography variant="h3" fontWeight="700" sx={{
                                        mb: 2,
                                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}>
                                        Classroom Quiz Challenge
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
                                        Test your classroom management skills with our professional quiz.
                                        Choose a mode that fits your schedule today.
                                    </Typography>
                                </motion.div>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 4,
                                justifyContent: "center",
                                width: "100%",
                                maxWidth: 1000,
                                mx: "auto"
                            }}>
                                {/* Random Quiz Mode */}
                                <Box sx={{ flex: 1, maxWidth: 480 }}>
                                    <motion.div variants={itemVariants}>
                                        <Card sx={{
                                            height: "100%",
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                borderColor: "primary.main",
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                                            }
                                        }} onClick={() => handleStartMode("random")}>
                                            <CardContent sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", height: "100%" }}>
                                                <Box sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: "50%",
                                                    background: "rgba(99, 102, 241, 0.1)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mx: "auto",
                                                    mb: 3,
                                                    color: "primary.main"
                                                }}>
                                                    <Shuffle sx={{ fontSize: 40 }} />
                                                </Box>
                                                <Typography variant="h5" fontWeight="700" gutterBottom>Random Quiz</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, mb: 3, flex: 1 }}>
                                                    Get 10 random questions from our full question bank. Perfect for a quick daily review.
                                                </Typography>
                                                <Divider sx={{ mb: 3 }} />
                                                <Box sx={{ display: "flex", justifyContent: "center", color: "text.secondary", fontSize: "0.85rem" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <Assignment fontSize="small" /> 10 Questions
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{ mt: 4, borderRadius: 2, fontWeight: 700, py: 1.5 }}
                                                >
                                                    Start Random
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Box>

                                {/* Full Quiz Mode */}
                                <Box sx={{ flex: 1, maxWidth: 480 }}>
                                    <motion.div variants={itemVariants}>
                                        <Card sx={{
                                            height: "100%",
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            // background: "rgba(0, 82, 212, 0.02)",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                borderColor: "primary.main",
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                                            }
                                        }} onClick={() => handleStartMode("full")}>
                                            <CardContent sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", height: "100%" }}>
                                                <Box sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: "50%",
                                                    background: "rgba(99, 102, 241, 0.1)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mx: "auto",
                                                    mb: 3,
                                                    color: "primary.main"
                                                }}>
                                                    <FormatListNumbered sx={{ fontSize: 40 }} />
                                                </Box>
                                                <Typography variant="h5" fontWeight="700" gutterBottom>Full Challenge</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, mb: 3, flex: 1 }}>
                                                    Complete all 50 professional scenarios. The ultimate test for classroom management mastery.
                                                </Typography>
                                                <Divider sx={{ mb: 3 }} />
                                                <Box sx={{ display: "flex", justifyContent: "center", color: "text.secondary", fontSize: "0.85rem" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <Assignment fontSize="small" /> 50 Questions
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        mt: 4,
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                        py: 1.5,
                                                    }}
                                                >
                                                    Start Complete
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Box>
                            </Box>

                        </motion.div>
                    </Container>
                </Box>
            </Box>
            <Footer />
        </Container>
    );
}