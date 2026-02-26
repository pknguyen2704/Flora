import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Chip,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  People as PeopleIcon,
  Mic as MicIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import userService from "~/services/userService";
import { getRelativeTime, formatLocalDate } from "~/utils/timeUtils";

// --- Custom Components for High-Fidelity Dashboard ---

const StatCard = ({ title, value, subtitle, icon, color, delay }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(color, 0.1),
          background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
          backdropFilter: "blur(10px)",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 24px ${alpha(color, 0.1)}`,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                color: color,
                display: "flex",
              }}
            >
              {icon}
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="subtitle2" fontWeight="700" color="text.primary">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            {subtitle}
          </Typography>
        </CardContent>
        {/* Decorative background element */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: alpha(color, 0.05),
            zIndex: 0,
          }}
        />
      </Card>
    </motion.div>
  );
};

const SimpleLineChart = ({ data, dataKey, color, height = 200 }) => {
  const theme = useTheme();
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d[dataKey]), 1);
  const width = 600;
  const padding = 20;

  const points = data.map((d, i) => ({
    x: padding + (i * (width - 2 * padding)) / (data.length - 1),
    y: height - padding - (d[dataKey] / maxVal) * (height - 2 * padding)
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <Box sx={{ width: "100%", height, mt: 2, position: "relative" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} V ${height - padding} H ${padding} Z`}
          fill={`url(#gradient-${dataKey})`}
        />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
        ))}
      </svg>
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, mt: 1 }}>
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
          <Typography key={i} variant="caption" color="text.secondary">
            {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const UserDetailModal = ({ user, open, onClose }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (open && user?.id) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const res = await userService.getUserStats(user.id);
          if (res.success) setUserData(res.data);
        } catch (e) {
          console.error("Failed to fetch user detail", e);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [open, user]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, p: 0, overflow: 'hidden' }
      }}
    >
      {loading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : userData ? (
        <>
          <DialogTitle sx={{
            p: 3,
            bgcolor: alpha(user.avatar_color || theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: user.avatar_color, width: 56, height: 56, fontSize: 24, fontWeight: 800 }}>
                {user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: -0.5 }}>{user.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">@{user.username}</Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed' }}>
                    <Typography variant="overline" color="text.secondary">Platform Engagement</Typography>
                    <Typography variant="h4" fontWeight="900" color="primary">{userData.activity?.total_sessions || 0}</Typography>
                    <Typography variant="caption">Total Practice Sessions</Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed' }}>
                    <Typography variant="overline" color="text.secondary">Last Active</Typography>
                    <Typography variant="subtitle1" fontWeight="700">
                      {userData.activity?.last_active ? getRelativeTime(userData.activity.last_active) : 'Never'}
                    </Typography>
                    <Typography variant="caption">{userData.activity?.days_active || 0} days of practice</Typography>
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon color="primary" /> Accuracy Trend (Last 30 Days)
                </Typography>
                <SimpleLineChart
                  data={userData.performance_timeline}
                  dataKey="accuracy"
                  color={theme.palette.success.main}
                  height={150}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MicIcon color="info" /> Pronunciation Mastery
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="700">Average Score</Typography>
                    <Typography variant="body2" fontWeight="900">{userData.pronunciation?.average_score}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={userData.pronunciation?.average_score || 0}
                    sx={{ height: 10, borderRadius: 5, bgcolor: alpha(theme.palette.info.main, 0.1) }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Based on {userData.pronunciation?.total_attempts} verbal exercises
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuizIcon color="secondary" /> Quiz Accuracy
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Perfect: ${userData.situations?.score_distribution?.perfect || 0}`}
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.dark', fontWeight: 700 }}
                  />
                  <Chip
                    label={`Acceptable: ${userData.situations?.score_distribution?.acceptable || 0}`}
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.dark', fontWeight: 700 }}
                  />
                  <Chip
                    label={`Needs Work: ${userData.situations?.score_distribution?.poor || 0}`}
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.dark', fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Average quiz score: {userData.situations?.average_score_percentage}%
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // User detail state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getGlobalStats();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("An error occurred while fetching dashboard data. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
        <CircularProgress thickness={5} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
          p: 3,
          textAlign: "center"
        }}
      >
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" fontWeight="800" gutterBottom>
            Offline or Data Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
          >
            Retry Fetch
          </Button>
        </motion.div>
      </Box>
    );
  }

  const { overview, activity_timeline, user_growth_timeline, group_performance, top_users, pronunciation, situations } = dashboardData || {};

  return (
    <Box sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: "-0.02em", mb: 1 }}>
            Insights <span style={{ color: theme.palette.primary.main }}>Overview</span>
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Real-time platform performance and user engagement metrics.
          </Typography>
        </motion.div>
        <Chip
          icon={<TimelineIcon />}
          label={`Last Updated: ${new Date().toLocaleTimeString()}`}
          variant="outlined"
          sx={{ borderRadius: 2, px: 1 }}
        />
      </Box>

      {/* Primary Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={overview?.total_users?.toLocaleString()}
            subtitle={`${overview?.active_users_today || 0} active today`}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Practice Volume"
            value={overview?.total_pronunciation_attempts?.toLocaleString()}
            subtitle={`Across all speech instructions`}
            icon={<MicIcon />}
            color={theme.palette.info.main}
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Accuracy"
            value={`${pronunciation?.average_score || 0}%`}
            subtitle="Overall pronunciation quality"
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quizzes Completed"
            value={overview?.total_quizzes_completed?.toLocaleString()}
            subtitle={`${situations?.average_accuracy || 0}% avg. accuracy`}
            icon={<QuizIcon />}
            color={theme.palette.secondary.main}
            delay={0.4}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Main Content Area - Left 8 columns */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

            {/* User Growth & Accuracy Timeline */}
            <Card elevation={0} sx={{ p: 4, borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "visible" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                  <Typography variant="h6" fontWeight="800">Engagement & Accuracy</Typography>
                  <Typography variant="body2" color="text.secondary">Cumulative user growth and daily accuracy trends</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: theme.palette.primary.main }} />
                    <Typography variant="caption" fontWeight="600">Growth</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: theme.palette.success.main }} />
                    <Typography variant="caption" fontWeight="600">Accuracy %</Typography>
                  </Box>
                </Box>
              </Box>
              <SimpleLineChart data={user_growth_timeline} dataKey="cumulative_users" color={theme.palette.primary.main} />
              <Box sx={{ mt: -4 }}>
                <SimpleLineChart data={activity_timeline} dataKey="avg_accuracy" color={theme.palette.success.main} height={150} />
              </Box>
            </Card>

            {/* Performance by Group */}
            <Card elevation={0} sx={{ p: 4, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                <BarChartIcon color="primary" />
                <Typography variant="h6" fontWeight="800">Top Performing Groups</Typography>
              </Box>
              <Grid container spacing={3}>
                {group_performance?.map((group, idx) => (
                  <Grid item xs={12} md={6} key={group.id}>
                    <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", "&:hover": { bgcolor: "rgba(0,0,0,0.01)" } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="700">{group.name}</Typography>
                        <Chip label={`${group.average_score}%`} size="small" color="primary" variant="soft" />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={group.average_score}
                        sx={{ height: 6, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        {group.total_attempts} attempts recorded
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>
        </Grid>

        {/* Sidebar Area - Right 4 columns */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

            {/* User Leaderboard */}
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                <TrophyIcon sx={{ color: "#FFD700" }} />
                <Typography variant="h6" fontWeight="800">Top Active Learners</Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {top_users?.map((user, idx) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 2,
                        transition: '0.2s',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                      }}
                      onClick={() => handleUserClick(user)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <Avatar sx={{ bgcolor: user.avatar_color, fontWeight: 700, width: 44, height: 44 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {idx < 3 && (
                          <Box sx={{ position: "absolute", bottom: -4, right: -4, bgcolor: "white", borderRadius: "50%", p: 0.2 }}>
                            <TrophyIcon sx={{ fontSize: 16, color: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : "#CD7F32" }} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight="700">{user.name}</Typography>
                          <ArrowForwardIcon sx={{ fontSize: 14, opacity: 0 }} className="arrow-icon" />
                        </Box>
                        <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="800" color="primary">{user.activity_count}</Typography>
                        <Typography variant="caption" color="text.secondary">Sessions</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />
              <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block" }}>
                Total engaged learners: {overview?.total_users}
              </Typography>
            </Card>

            {/* Platform Metrics Distribution */}
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" /> Platform Distribution
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight="700">Pronunciation Mastery</Typography>
                    <Typography variant="caption" fontWeight="900" color="primary">{pronunciation?.average_mastery || 0}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pronunciation?.average_mastery || 0}
                    sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight="700">Situational Awareness</Typography>
                    <Typography variant="caption" fontWeight="900" color="secondary">{situations?.average_accuracy || 0}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={situations?.average_accuracy || 0}
                    sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}
                  />
                </Box>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PsychologyIcon fontSize="small" color="info" /> Learning Insight
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pronunciation?.average_mastery > situations?.average_accuracy
                      ? "Verbal communication is currently outperforming situational quiz results across the platform."
                      : "Students are showing stronger situational understanding compared to verbal pronunciation scores."}
                  </Typography>
                </Paper>
              </Box>
            </Card>

            {/* Platform Health/Health Score */}
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h6" fontWeight="800" gutterBottom>Platform Engagement</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                  Overall system health and user retention status.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box>
                    <Typography variant="h4" fontWeight="900">Excellent</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>92% active retention</Typography>
                  </Box>
                  <CircularProgress
                    variant="determinate"
                    value={92}
                    size={60}
                    thickness={6}
                    sx={{ color: "rgba(255,255,255,0.9)" }}
                  />
                </Box>
              </Box>
              {/* Decorative SVG shapes */}
              <Box sx={{ position: "absolute", right: -20, bottom: -20, opacity: 0.1 }}>
                <PeopleIcon sx={{ fontSize: 120 }} />
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>

      {/* User Detail Modal Implementation */}
      <UserDetailModal
        user={selectedUser}
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
      />
    </Box>
  );
};

export default AdminDashboard;
