import React from "react";
import { Box, Typography, Card, CircularProgress } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Container from "@mui/material/Container";
import { motion } from "framer-motion";

import Appbar from "~/components/Appbar/Appbar";
import Sidebar from "~/components/Sidebar/Sidebar";
import Footer from "~/components/Footer/Footer";
import { useSidebar } from "~/contexts/SidebarContext";
import handbookPdf from "~/assets/pdfs/handbook.pdf";
import { pageTransition, smoothSpring } from "~/utils/animations";

export default function Learning() {
    const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
                        px: { xs: 4, sm: 8, md: 12 },
                    }}
                >
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{ width: "100%", maxWidth: "1400px" }}
                    >
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
                                    Handbook Classroom Instructions
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                                    Review the official handbook to master professional communication scenarios.
                                </Typography>
                            </Box>
                        </Box>

                        <Card
                            elevation={0}
                            sx={{
                                height: "calc(100vh - 280px)",
                                minHeight: "600px",
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: "divider",
                                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
                                bgcolor: "background.paper",
                                p: { xs: 0, md: 1 },
                                "& .rpv-core__viewer": {
                                    border: "none !important",
                                },
                                // Hide specific document actions
                                "& [aria-label='Open file'], & [aria-label='Download'], & [aria-label='Print'], & [aria-label='Attachment']": {
                                    display: "none !important",
                                }
                            }}
                        >
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                <Viewer
                                    fileUrl={handbookPdf}
                                    plugins={[defaultLayoutPluginInstance]}
                                    theme={{
                                        theme: "light",
                                    }}
                                    renderLoader={(percentages) => (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <CircularProgress size={48} thickness={4} sx={{ mb: 2, color: 'primary.main' }} />
                                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                Loading your learning materials... {Math.round(percentages)}%
                                            </Typography>
                                        </Box>
                                    )}
                                />
                            </Worker>
                        </Card>
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Footer />
        </Container>
    );
}