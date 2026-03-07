import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  Chip
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
  tapScale,
  pageTransition
} from "~/utils/animations";

function Overview({ stats }) {
  const navigate = useNavigate();
  const groupsProgress = stats?.groups_progress || [];
  const globalSituations = stats?.situations || {};

  const handleGroupClick = (groupId) => {
    // Navigate directly to quiz practice for this group
    navigate(`/quiz/content/${groupId}`);
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
        {/* INSTRUCTION QUIZ SECTION */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Instruction Practice Groups
          </Typography>
          <Grid container spacing={2.5}>
            {groupsProgress.map((group) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`group-${group.group_id}`}>
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
                  onClick={() => handleGroupClick(group.group_id)}
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: group.color_hex ? alpha(group.color_hex, 0.4) : "divider",
                    bgcolor: group.color_hex ? alpha(group.color_hex, 0.05) : "background.paper",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{
                    p: 2,
                    bgcolor: group.color ? alpha(group.color, 0.08) : "rgba(0,0,0,0.02)",
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: group.color || 'primary.main',
                        flexShrink: 0
                      }} />
                      <Typography variant="subtitle2" fontWeight="800" noWrap>
                        {group.name}
                      </Typography>
                    </Box>
                    {/* <Chip
                      label={`${group.total_answers || 0}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: group.color ? alpha(group.color, 0.15) : "divider",
                        color: 'text.primary'
                      }}
                    /> */}
                  </Box>

                  <CardContent sx={{ p: 2, flex: 1 }}>
                    <Grid container spacing={1.5}>
                      {/* Situation Handling Score */}
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(79, 70, 229, 0.03)', border: '1px solid rgba(79, 70, 229, 0.05)' }}>
                          <Typography variant="caption" fontWeight="700" color="primary.main" sx={{ display: 'block', mb: 0.5, fontSize: '0.6rem', textTransform: 'uppercase' }}>
                            Situation
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem' }}>
                              {group.situation_score?.highest?.point || 0}/{group.situation_score?.highest?.total || 0}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            Latest: {group.situation_score?.latest?.point || 0}/{group.situation_score?.latest?.total || 0}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Pronunciation Score */}
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.05)' }}>
                          <Typography variant="caption" fontWeight="700" color="success.main" sx={{ display: 'block', mb: 0.5, fontSize: '0.6rem', textTransform: 'uppercase' }}>
                            Pronunciation
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem', color: 'success.main' }}>
                              {group.pronunciation_score?.highest || 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>/10</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            Latest: {group.pronunciation_score?.latest || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                  </CardContent>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Grid>
      </Grid>
    </Box >
  );
}

export default Overview;
