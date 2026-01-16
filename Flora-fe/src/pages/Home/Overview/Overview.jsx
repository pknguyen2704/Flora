import React from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  Mic as MicIcon,
  TrendingUp as TrendingUpIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material";

function Overview({ stats }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}15 100%)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: (theme) =>
                  `0 12px 24px ${theme.palette.primary.main}20`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <MicIcon />
                </Box>
              </Box>
              <Typography
                variant="h4"
                fontWeight="700"
                color="primary.main"
                gutterBottom
              >
                {stats?.pronunciation?.total_attempts || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pronunciation Attempts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.light}15 100%)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "success.main",
                boxShadow: (theme) =>
                  `0 12px 24px ${theme.palette.success.main}20`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Box>
              <Typography
                variant="h4"
                fontWeight="700"
                color="success.main"
                gutterBottom
              >
                {stats?.pronunciation?.average_score || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.light}15 100%)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "secondary.main",
                boxShadow: (theme) =>
                  `0 12px 24px ${theme.palette.secondary.main}20`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <QuizIcon />
                </Box>
              </Box>
              <Typography
                variant="h4"
                fontWeight="700"
                color="secondary.main"
                gutterBottom
              >
                {stats?.situations?.total_quizzes || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quizzes Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Overview;
