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
  Chip,
} from "@mui/material";
import {
  RecordVoiceOver,
  QuestionAnswer,
  Assessment,
  School,
  ArrowForward,
  AutoAwesome,
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
      color: "#0052D4",
    },
    {
      icon: <QuestionAnswer fontSize="large" />,
      title: "Situation Handling",
      description:
        "Practice real classroom scenarios and learn the best ways to respond",
      color: "#00AA66",
    },
    {
      icon: <Assessment fontSize="large" />,
      title: "Progress Tracking",
      description:
        "Track your improvement with detailed statistics and performance insights",
      color: "#FF6600",
    },
    {
      icon: <School fontSize="large" />,
      title: "Structured Learning",
      description:
        "Organized content groups covering different aspects of classroom instruction",
      color: "#9900CC",
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* AppBar */}
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          height: (theme) => theme.flora.appBarHeight,
          px: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <img src={logo_white} alt="Flora Logo" style={{ height: "56px" }} />
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": {
              bgcolor: "grey.100",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
            transition: "all 0.3s",
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          background: "#0052D4",
        }}
      >
        {/* Animated Background Gradient Waves */}
        <Box
          component={motion.div}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(-45deg, #0052D4, #4A90E2, #00BFFF, #1E90FF)",
            backgroundSize: "400% 400%",
          }}
        />

        {/* Animated Overlay Shapes */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <Box
          component={motion.div}
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 191, 255, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, color: "white" }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                component={motion.div}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Chip
                  icon={<AutoAwesome />}
                  label="AI-Powered Learning Platform"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    mb: 3,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  fontWeight="700"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Master Classroom English
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
                  Practice pronunciation and handle classroom situations with
                  confidence using AI-powered feedback
                </Typography>
                <Stack direction="row" spacing={2}>
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
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component={motion.div}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  display: { xs: "none", md: "block" },
                  position: "relative",
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.1)",
                    position: "relative",
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RecordVoiceOver sx={{ fontSize: 80, opacity: 0.9 }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
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
                background: "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)",
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

          <Grid
            container
            spacing={4}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                component={motion.div}
                variants={itemVariants}
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
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 4,
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: feature.color,
                      boxShadow: `0 12px 24px ${feature.color}20`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        bgcolor: `${feature.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: feature.color,
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
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
          background: "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)",
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

      <Footer />
    </Container>
  );
}

export default Introduction;
