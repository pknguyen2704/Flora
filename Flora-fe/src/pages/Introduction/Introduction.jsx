import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  RecordVoiceOver,
  QuestionAnswer,
  Assessment,
  School,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import logo_white from "~/assets/logo_white.svg";
import Footer from "~/components/footer/Footer";

function Introduction() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RecordVoiceOver fontSize="large" />,
      title: "Pronunciation Practice",
      description:
        "AI-powered feedback on your English pronunciation with detailed error analysis",
      colorKey: "primary.main",
    },
    {
      icon: <QuestionAnswer fontSize="large" />,
      title: "Situation Handling",
      description:
        "Practice real classroom scenarios and learn the best ways to respond",
      colorKey: "success.main",
    },
    {
      icon: <Assessment fontSize="large" />,
      title: "Progress Tracking",
      description:
        "Track your improvement with detailed statistics and performance insights",
      colorKey: "warning.main",
    },
    {
      icon: <School fontSize="large" />,
      title: "Structured Learning",
      description:
        "Organized content groups covering different aspects of classroom instruction",
      colorKey: "info.main",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Hero Section with Integrated Navigation */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          bgcolor: "primary.main",
          height: "80vh",
        }}
      >
        <img src={logo_white} alt="Flora Logo" style={{ height: "128px" }} />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="700"
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          Classroom Instructions Support
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            opacity: 0.95,
            lineHeight: 1.6,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
          }}
        >
          Practice pronunciation and handle classroom situations with confidence
          using AI-powered feedback
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/login")}
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "grey.100",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s",
          }}
        >
          Start Learning
        </Button>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          py: { xs: 4, md: 6 },
          bgcolor: "background.default",
          height: "80vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component={motion.div}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <Typography
            variant="h3"
            fontWeight="700"
            gutterBottom
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Why Choose Flora?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Everything you need to improve your classroom English skills
          </Typography>
        </Box>

        <Container
          maxWidth="xl"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            justifyContent="center"
            wrap="nowrap"
            sx={{ maxWidth: "1400px" }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs="auto"
                key={index}
                component={motion.div}
                variants={itemVariants}
                sx={{ minWidth: 280, maxWidth: 320 }}
              >
                <Card
                  component={motion.div}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: feature.colorKey,
                    color: "white",
                    borderRadius: 4,
                    transition: "all 0.3s",
                    border: "none",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: (theme) => theme.shadows[8],
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "left",
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      gutterBottom
                      sx={{ mb: 2, color: "white" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                        flex: 1,
                        minHeight: "100px",
                        color: "rgba(255, 255, 255, 0.9)",
                        mb: 4,
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Circular arrow icon at bottom */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        mt: "auto",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          borderColor: "white",
                        },
                      }}
                    >
                      <ArrowForward />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h3" fontWeight="700" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              Join Flora today and start improving your classroom English skills
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                borderRadius: 3,
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s",
              }}
            >
              Login Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Container>
  );
}

export default Introduction;
