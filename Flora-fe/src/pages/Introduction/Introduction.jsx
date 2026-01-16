import React, { useState, useEffect } from "react";
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
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  RecordVoiceOver,
  QuestionAnswer,
  Assessment,
  School,
  ArrowForward,
  Email,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import logo_white from "~/assets/logo_white.svg";
import Footer from "~/components/footer/Footer";

function Introduction() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple scroll spy logic
      const sections = ["hero", "features", "team"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Trigger when section top is near the header (120px)
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const team = [
    {
      name: "Phuc Nguyen",
      role: "Leader",
      faculty: "TESOL & Applied Linguistics",
      university: "University Example",
      email: "phucnguyen@example.com",
      avatar: null,
    },
    {
      name: "Andrew Le",
      role: "Member",
      faculty: "Computer Science",
      university: "Tech University",
      email: "andrewle@example.com",
      avatar: null,
    },
    {
      name: "Member Name",
      role: "Member",
      faculty: "Faculty Name",
      university: "University Name",
      email: "member@example.com",
      avatar: null,
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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Navigation Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "transparent !important",
          backgroundColor: "transparent !important",
          backgroundImage: "none",
          boxShadow: "none",
          color: "white",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          pt: 2,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              bgcolor: "rgba(2, 21, 58, 0.9)", // Deep navy blue instead of charcoal
              backdropFilter: "blur(25px)",
              borderRadius: "50px",
              px: { xs: 2, md: 4 },
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: scrolled ? "0 12px 40px rgba(0, 0, 0, 0.3)" : "none",
              mt: 2, // Fixed margin to prevent jumping
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
              }}
              onClick={() => scrollToSection("hero")}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo_white}
                  alt="Flora Logo"
                  style={{ height: "100%", width: "auto" }}
                />
              </Box>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <Button
                color="inherit"
                onClick={() => scrollToSection("hero")}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  borderRadius: "20px",
                  bgcolor:
                    activeSection === "hero" ? "primary.main" : "transparent",
                  color: "white",
                  "&:hover": {
                    bgcolor:
                      activeSection === "hero"
                        ? "primary.dark"
                        : "rgba(255,255,255,0.1)",
                  },
                  boxShadow:
                    activeSection === "hero"
                      ? "0 4px 12px rgba(0, 123, 255, 0.4)"
                      : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection("features")}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  borderRadius: "20px",
                  bgcolor:
                    activeSection === "features"
                      ? "primary.main"
                      : "transparent",
                  color: "white",
                  "&:hover": {
                    bgcolor:
                      activeSection === "features"
                        ? "primary.dark"
                        : "rgba(255,255,255,0.1)",
                  },
                  boxShadow:
                    activeSection === "features"
                      ? "0 4px 12px rgba(0, 123, 255, 0.4)"
                      : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection("team")}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  borderRadius: "20px",
                  bgcolor:
                    activeSection === "team" ? "primary.main" : "transparent",
                  color: "white",
                  "&:hover": {
                    bgcolor:
                      activeSection === "team"
                        ? "primary.dark"
                        : "rgba(255,255,255,0.1)",
                  },
                  boxShadow:
                    activeSection === "team"
                      ? "0 4px 12px rgba(0, 123, 255, 0.4)"
                      : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Our team
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  ml: 2,
                  borderRadius: "50px",
                  bgcolor: "white",
                  color: "primary.main",
                  px: 3,
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    bgcolor: "grey.100",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(255, 255, 255, 0.3)",
                  },
                  transition:
                    "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
          background: "#0035A0", // Deep blue from image
          height: "90vh",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "150%",
            height: "150%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 100%)",
            borderRadius: "50%",
          },
          // Concentric circles logic moved into CSS
          "& .ripple": {
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            pointerEvents: "none",
          },
        }}
      >
        {[400, 600, 800, 1000, 1200].map((size, i) => (
          <Box
            key={i}
            className="ripple"
            sx={{
              width: size,
              height: size,
            }}
          />
        ))}

        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}
        >
          <img
            src={logo_white}
            alt="Flora Logo"
            style={{ height: "100px", marginBottom: "2rem" }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="900"
            sx={{
              fontSize: { xs: "3rem", md: "5rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "900px",
              mb: 6,
            }}
          >
            Classroom Instructions Support
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "white",
              color: "#0035A0",
              borderRadius: "50px",
              px: { xs: 4, md: 8 },
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 800,
              boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
              textTransform: "uppercase",
              "&:hover": {
                bgcolor: "grey.100",
                transform: "translateY(-4px)",
                boxShadow: "0 0 50px rgba(255, 255, 255, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            Explore Now
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper", // White
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

      <Box
        id="team"
        sx={{
          pt: 20,
          pb: 15,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              Flora is built by a dedicated team of educators and engineers
              passionate about transforming language learning through
              technology.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center" sx={{ mb: 12 }}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    textAlign: "center",
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.07)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                      "& .avatar-glow": {
                        boxShadow: (theme) =>
                          `0 0 30px ${theme.palette.primary.main}`,
                      },
                    },
                  }}
                >
                  <Box
                    className="avatar-glow"
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 4,
                      position: "relative",
                      border: "2px solid rgba(255,255,255,0.1)",
                      transition: "all 0.4s ease",
                      overflow: "hidden",
                    }}
                  >
                    {member.avatar ? (
                      <Box
                        component="img"
                        src={member.avatar}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h3"
                        sx={{ color: "white", fontWeight: 300 }}
                      >
                        {member.name.charAt(0)}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 3,
                      color: "primary.light",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {member.role || "Team Member"}
                  </Typography>

                  <Box
                    sx={{
                      mt: "auto",
                      width: "100%",
                      pt: 3,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}
                    >
                      {member.faculty}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, opacity: 0.5, fontSize: "0.75rem" }}
                    >
                      {member.university}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        opacity: 0.9,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Email sx={{ fontSize: "1rem", opacity: 0.7 }} />
                      {member.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Minimal Contact Section Integrated */}
          <Box
            id="contact"
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            sx={{
              pt: 6,
              mt: 4,
              position: "relative",
              textAlign: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "20%",
                right: "20%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ mb: 1, color: "white" }}
            >
              Have Questions?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.6 }}>
              Reach out to our project lead
            </Typography>
            <Button
              variant="contained"
              size="medium"
              startIcon={<Email />}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 1.2,
                borderRadius: "50px",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
              onClick={() =>
                (window.location.href = "mailto:phucnguyen@example.com")
              }
            >
              Contact Lead
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
