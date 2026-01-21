import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Stack,
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

  const handleGroupClick = (groupId) => {
    // Find the group data
    const sourceGroup = groupsProgress.find(g => (g.group_id || g._id) === groupId);

    if (!sourceGroup) return;

    // Map Overview data structure to Group.jsx expected structure
    const group = {
      id: sourceGroup.group_id || sourceGroup._id,
      group_id: sourceGroup.group_id || sourceGroup._id,
      name: sourceGroup.name,
      description: sourceGroup.description || '',
      color_hex: sourceGroup.color || '#0052D4',
      group_number: sourceGroup.group_number || sourceGroup.group_id,
      instruction_count: sourceGroup.pronunciation?.total || 0,
      situation_count: sourceGroup.situations?.total || 0,
    };

    // Navigate with group data to avoid re-fetching
    navigate(`/group/${groupId}`, { state: { group } });
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: "100%" }}
    >
      <Grid container spacing={4}>

        {/* GROUP PROGRESS SECTION */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {groupsProgress.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.group_id}>
                <Card
                  component={motion.div}
                  variants={itemVariants}
                  whileHover={hoverScale}
                  whileTap={tapScale}
                  elevation={0}
                  onClick={() => handleGroupClick(group.group_id || group._id)}
                  sx={{
                    // borderRadius: 2, // Use theme default (which is now 16px/20px)
                    border: "1px solid",
                    borderColor: "divider",
                    height: '100%',
                    width: '400px',
                    transition: "all 0.2s",
                    cursor: 'pointer',
                    // Hover shadow handled by theme override
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: group.color || 'primary.main', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="700" noWrap>
                        {group.name}
                      </Typography>
                    </Box>

                    {/* Pronunciation Progress Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mic sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">Pronunciation</Typography>
                        </Box>
                        <Typography variant="caption" fontWeight="600">
                          {group.pronunciation.practiced || 0}/{group.pronunciation.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={group.pronunciation.total > 0 ? ((group.pronunciation.practiced || 0) / group.pronunciation.total) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: group.color } }}
                      />
                    </Box>

                    {/* Situation Progress Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <QuestionAnswer sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">Situations</Typography>
                        </Box>
                        <Typography variant="caption" fontWeight="600">
                          {group.situations.encountered}/{group.situations.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={group.situations.total > 0 ? (group.situations.encountered / group.situations.total) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: group.color } }}
                      />
                    </Box>

                    {/* INLINE DETAILS (Only shown if items exist) */}

                  </CardContent>
                </Card>
              </Grid>
            ))}
            {groupsProgress.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">No group data available.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>


      </Grid>
    </Box>
  );
}

export default Overview;
