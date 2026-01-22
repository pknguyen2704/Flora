import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  Mic,
  QuestionAnswer,
  Star
} from "@mui/icons-material";
import {
  containerVariants,
  itemVariants,
  hoverScale,
  tapScale
} from "~/utils/animations";

function Overview({ stats }) {
  const navigate = useNavigate();
  const groupsProgress = stats?.groups_progress || [];
  const globalSituations = stats?.situations || {};

  const handleGroupClick = (groupId) => {
    // Navigate directly to pronunciation practice for this group
    navigate(`/pronunciation/${groupId}`);
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: "100%", pb: 8 }}
    >
      <Grid container spacing={4}>

        {/* QUIZ COMPLETION OVERVIEW (GLOBAL) */}
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Quiz Master Progress
          </Typography>
          <Card
            component={motion.div}
            variants={itemVariants}
            whileHover={hoverScale}
            whileTap={tapScale}
            elevation={0}
            onClick={() => navigate("/quiz")}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(3, 169, 244, 0.05) 100%)",
              transition: "all 0.2s",
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              "&:hover": { borderColor: "primary.main" }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <QuestionAnswer />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="800">Professional Scenarios</Typography>
                      <Typography variant="body2" color="text.secondary">Global Mastery Status</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight="700">Completion</Typography>
                      <Typography variant="caption" fontWeight="800" color="primary.main">
                        {globalSituations.total_encountered || 0}/50 SCENARIOS
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((globalSituations.total_encountered || 0) / 50) * 100, 100)}
                      sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="h4" fontWeight="800" color="primary.main">
                      {globalSituations.average_score_percentage || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="700">OVERALL SCORE</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sx={{ my: 1 }}>
          <Divider sx={{ width: "100%" }} />
        </Grid>

        {/* INSTRUCTION PRONUNCIATION SECTION */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Instruction Practice Groups
          </Typography>
          <Grid container spacing={2.5}>
            {groupsProgress.map((group) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`pron-${group.group_id}`}>
                <Card
                  component={motion.div}
                  variants={itemVariants}
                  whileHover={hoverScale}
                  whileTap={tapScale}
                  elevation={0}
                  onClick={() => handleGroupClick(group.group_id || group._id)}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    cursor: 'pointer',
                    bgcolor: "background.paper",
                    height: '100%',
                    minHeight: 160,
                    width: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    "&:hover": {
                      borderColor: group.color || 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent sx={{
                    p: 2.5,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:last-child': { pb: 2.5 }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, minHeight: 44 }}>
                      <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: group.color || 'primary.main',
                        mr: 1.5,
                        mt: 0.5,
                        flexShrink: 0
                      }} />
                      <Typography variant="subtitle2" fontWeight="700" sx={{
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word'
                      }}>
                        {group.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mic sx={{ fontSize: 14, color: 'primary.main', flexShrink: 0 }} />
                          <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.7rem' }}>
                            Pronunciation Progress
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight="700" color="text.secondary">
                          {group.pronunciation.practiced || 0}/{group.pronunciation.total}
                        </Typography>
                        <Typography variant="caption" fontWeight="700" color="primary.main">
                          {group.pronunciation.total > 0
                            ? Math.round(((group.pronunciation.practiced || 0) / group.pronunciation.total) * 100)
                            : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={group.pronunciation.total > 0 ? ((group.pronunciation.practiced || 0) / group.pronunciation.total) * 100 : 0}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.04)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: group.color || 'primary.main',
                            borderRadius: 3
                          }
                        }}
                      />

                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {group.pronunciation.mastered || 0} items mastered
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Overview;
