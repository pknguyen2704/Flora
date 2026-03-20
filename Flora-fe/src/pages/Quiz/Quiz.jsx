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
import { alpha } from "@mui/material/styles";
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
    tapScale,
    smoothSpring
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
                        px: { xs: 4, sm: 8, md: 12 },
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: "1400px" }}>
                        <Box
                            component={motion.div}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Section Header */}
                            <Box
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={pageTransition}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    py: { xs: 3, sm: 4, md: 6 },
                                    gap: { xs: 2, sm: 3, md: 4 },
                                    flexWrap: 'wrap'
                                }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        sx={{
                                            mb: 1,
                                            background: (theme) =>
                                                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                                        }}
                                    >
                                        Quiz Groups
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
                                    >
                                        Choose a group to start the quiz challenge
                                    </Typography>
                                </Box>
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
                                                layout
                                                variants={itemVariants}
                                                whileHover={{
                                                    ...hoverScale,
                                                    y: -5,
                                                    boxShadow: group.color_hex
                                                        ? `0 20px 40px ${alpha(group.color_hex, 0.15)}`
                                                        : "0 20px 40px rgba(0,0,0,0.12)"
                                                }}
                                                whileTap={tapScale}
                                                elevation={0}
                                                sx={{
                                                    height: "100%",
                                                    borderRadius: 2,
                                                    border: "1px solid",
                                                    borderColor: group.color_hex ? alpha(group.color_hex, 0.4) : "divider",
                                                    bgcolor: group.color_hex ? alpha(group.color_hex, 0.05) : "background.paper",
                                                    overflow: "hidden",
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
                                                            borderRadius: 2,
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
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Footer />
        </Container>
    );
}