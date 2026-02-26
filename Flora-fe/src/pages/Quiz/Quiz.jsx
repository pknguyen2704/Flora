import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import Appbar from "~/components/Appbar/Appbar";
import Footer from "~/components/Footer/Footer";
import {
    containerVariants,
    itemVariants,
    pageVariants,
    pageTransition,
    hoverScale,
    tapScale
} from "~/utils/animations";

export default function Quiz() {
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
        // Navigate directly to quiz mode for this group
        navigate(`/quiz/content/${groupId}`);
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
                                sx={{ mb: 6, textAlign: "center" }}
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
                                    Quiz Groups
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ maxWidth: 600, mx: "auto" }}
                                >
                                    Choose a group to start the quiz challenge
                                </Typography>
                            </Box>

                            {/* Groups Grid */}
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                                    <CircularProgress size={48} />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            ) : (
                                <Box
                                    component={motion.div}
                                    variants={containerVariants}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        gap: 3,
                                        width: "100%",
                                        justifyContent: "center",
                                    }}
                                >
                                    {groups.map((group, index) => (
                                        <Box
                                            component={motion.div}
                                            variants={itemVariants}
                                            key={group.id || group._id || index}
                                            sx={{
                                                width: {
                                                    xs: "100%",
                                                    sm: "calc(50% - 12px)",
                                                    md: "calc(33.333% - 16px)",
                                                },
                                            }}
                                        >
                                            <Card
                                                component={motion.div}
                                                whileHover={hoverScale}
                                                whileTap={tapScale}
                                                elevation={0}
                                                sx={{
                                                    height: "100%",
                                                    borderRadius: 2, // Use theme default
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    overflow: "hidden",
                                                    "&:hover": {
                                                        borderColor: group.color_hex,
                                                        // boxShadow: (theme) => theme.shadows[8],
                                                    },
                                                }}
                                            >
                                                <CardActionArea
                                                    onClick={() =>
                                                        handleGroupClick(group.id || group._id)
                                                    }
                                                    sx={{
                                                        height: "100%",
                                                        p: 4,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-start",
                                                    }}
                                                >
                                                    {/* Color Indicator Bar */}
                                                    <Box
                                                        sx={{
                                                            width: 60,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: group.color_hex,
                                                            mb: 3,
                                                        }}
                                                    />

                                                    {/* Group Number Badge */}
                                                    <Chip
                                                        label={`Group ${group.group_number}`}
                                                        size="small"
                                                        sx={{
                                                            mb: 3,
                                                            bgcolor: `${group.color_hex}15`,
                                                            color: group.color_hex,
                                                            fontWeight: 600,
                                                            border: "none",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    />

                                                    {/* Group Info */}
                                                    <Typography
                                                        variant="h5"
                                                        fontWeight="700"
                                                        gutterBottom
                                                        sx={{ mb: 2 }}
                                                    >
                                                        {group.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mb: 4,
                                                            flex: 1,
                                                            lineHeight: 1.7,
                                                        }}
                                                    >
                                                        {group.description}
                                                    </Typography>

                                                    {/* Stats with modern styling */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 4,
                                                            width: "100%",
                                                            pt: 3,
                                                            borderTop: "1px solid",
                                                            borderColor: "divider",
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography
                                                                variant="h5"
                                                                fontWeight="700"
                                                                color={group.color_hex}
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                {group.situation_count}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{ fontSize: "0.875rem" }}
                                                            >
                                                                Quizzes Available
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardActionArea>
                                            </Card>
                                        </Box>
                                    ))}
                                </Box>
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