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
  TextField,
  InputAdornment,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Collapse,
  Badge,
} from "@mui/material";
import {
  People as PeopleIcon,
  Mic as MicIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday,
} from "@mui/icons-material";
import userService from "~/services/userService";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loadingUserStats, setLoadingUserStats] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          userService.getGlobalStats(),
          userService.getAllUsers(),
        ]);
        setStats(statsResponse.data);
        setUsers(usersResponse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserSelect = async (user) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
      setUserStats(null);
      return;
    }

    setSelectedUser(user);
    setLoadingUserStats(true);
    try {
      const response = await userService.getUserStats(user.id);
      setUserStats(response.data);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setLoadingUserStats(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const errorList = stats?.pronunciation?.error_distribution
    ? Object.entries(stats.pronunciation.error_distribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  // Get active users (logged in within last 24 hours)
  const activeUsersCount = users.filter((user) => {
    if (!user.last_login) return false;
    const lastLogin = new Date(user.last_login);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lastLogin > dayAgo;
  }).length;

  // Search filtered users
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query)
    );
  });

  // Get top users by activity (simplified - can be enhanced with real stats)
  const topUsers = [...users]
    .sort((a, b) => {
      const aLogin = a.last_login ? new Date(a.last_login) : new Date(0);
      const bLogin = b.last_login ? new Date(b.last_login) : new Date(0);
      return bLogin - aLogin;
    })
    .slice(0, 5);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Helper to get avatar color
  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getRelativeTime = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive platform analytics and user insights
        </Typography>
      </Box>

      {/* Global Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.light}10 100%)`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="700">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="800" color="primary">
                {stats?.overview?.total_users || 0}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {activeUsersCount} active today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.info.main}10 0%, ${theme.palette.info.light}10 100%)`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MicIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="700">
                  Pronunciation Attempts
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="800" color="info.main">
                {stats?.overview?.total_pronunciation_attempts || 0}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Avg: {stats?.pronunciation?.average_score || 0}% accuracy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.success.main}10 0%, ${theme.palette.success.light}10 100%)`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="700">
                  Avg. Mastery
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="800" color="success.main">
                {stats?.pronunciation?.average_mastery || 0}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Platform-wide progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.secondary.main}10 0%, ${theme.palette.secondary.light}10 100%)`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <QuizIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="700">
                  Quizzes Completed
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="800" color="secondary.main">
                {stats?.overview?.total_quizzes_completed || 0}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {stats?.situations?.total_questions || 0} total questions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Left Column - Global Stats */}
        <Grid item xs={12} lg={7}>
          <Grid container spacing={3}>
            {/* Mastery Insights */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6" fontWeight="700">
                    Global Mastery Progress
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h3" fontWeight="900" color="primary">
                        {stats?.pronunciation?.average_mastery || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average student mastery across all phrases
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats?.pronunciation?.average_mastery || 0}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: "rgba(0,0,0,0.05)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 6,
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    sx={{ mb: 2 }}
                  >
                    Top Pronunciation Challenges
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {errorList.map(([type, count]) => (
                      <Paper
                        key={type}
                        elevation={0}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {type}
                        </Typography>
                        <Chip
                          label={count}
                          size="small"
                          color="error"
                          variant="soft"
                        />
                      </Paper>
                    ))}
                    {errorList.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No error data available yet.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Quiz Accuracy */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 4,
                  }}
                >
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6" fontWeight="700">
                    Quiz Accuracy Breakdown
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="700">
                        Perfect Responses
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="success.main"
                      >
                        {stats?.situations?.perfect_answers || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        stats?.situations?.total_questions
                          ? (stats.situations.perfect_answers /
                              stats.situations.total_questions) *
                            100
                          : 0
                      }
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="700">
                        Acceptable
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="warning.main"
                      >
                        {stats?.situations?.acceptable_answers || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        stats?.situations?.total_questions
                          ? (stats.situations.acceptable_answers /
                              stats.situations.total_questions) *
                            100
                          : 0
                      }
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="700">
                        Poor / Needs Work
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="error.main"
                      >
                        {stats?.situations?.poor_answers || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        stats?.situations?.total_questions
                          ? (stats.situations.poor_answers /
                              stats.situations.total_questions) *
                            100
                          : 0
                      }
                      color="error"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(0,0,0,0.02)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <InfoIcon color="primary" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Based on {stats?.situations?.total_questions || 0} total
                      questions answered across all quiz sessions.
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - User Insights */}
        <Grid item xs={12} lg={5}>
          <Grid container spacing={3}>
            {/* User Search & Insights */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight="700">
                    User Insights
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Search users..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                  {filteredUsers.slice(0, 10).map((user) => (
                    <Box key={user.id}>
                      <Box
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "action.hover" },
                          transition: "all 0.2s",
                        }}
                        onClick={() => handleUserSelect(user)}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: getAvatarColor(user.full_name),
                              fontSize: "0.875rem",
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(user.full_name)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight="600" noWrap>
                              {user.full_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {user.email}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              label={user.role}
                              size="small"
                              color={
                                user.role === "admin" ? "primary" : "default"
                              }
                              sx={{ mb: 0.5 }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {getRelativeTime(user.last_login)}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {selectedUser?.id === user.id ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      <Collapse
                        in={selectedUser?.id === user.id}
                        timeout="auto"
                      >
                        {loadingUserStats ? (
                          <Box
                            sx={{
                              p: 3,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <CircularProgress size={24} />
                          </Box>
                        ) : userStats ? (
                          <Box
                            sx={{
                              p: 3,
                              bgcolor: "action.hover",
                              borderRadius: 2,
                              mx: 2,
                              mb: 2,
                            }}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: "center" }}>
                                  <MicIcon color="primary" sx={{ mb: 1 }} />
                                  <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    color="primary"
                                  >
                                    {userStats.pronunciation?.average_score ||
                                      0}
                                    %
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Pronunciation
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: "center" }}>
                                  <QuizIcon color="success" sx={{ mb: 1 }} />
                                  <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    color="success.main"
                                  >
                                    {userStats.situations
                                      ?.average_score_percentage || 0}
                                    %
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Quiz Accuracy
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: "center" }}>
                                  <CalendarToday
                                    color="secondary"
                                    sx={{ mb: 1 }}
                                  />
                                  <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    color="secondary"
                                  >
                                    {userStats.activity?.days_active || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Days Active
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {userStats.pronunciation?.total_attempts || 0}{" "}
                              pronunciation attempts •{" "}
                              {userStats.situations?.total_quizzes || 0} quizzes
                              completed
                            </Typography>
                          </Box>
                        ) : null}
                      </Collapse>
                    </Box>
                  ))}
                  {filteredUsers.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No users found
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Top Performers */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <TrophyIcon sx={{ color: "#FFD700" }} />
                  <Typography variant="h6" fontWeight="700">
                    Most Active Users
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {topUsers.map((user, index) => (
                    <Box
                      key={user.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                          index === 0
                            ? "rgba(255, 215, 0, 0.1)"
                            : "transparent",
                        border: "1px solid",
                        borderColor: index === 0 ? "#FFD700" : "divider",
                      }}
                    >
                      <Badge
                        badgeContent={index + 1}
                        color={index === 0 ? "warning" : "default"}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontWeight: 700,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: getAvatarColor(user.full_name),
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(user.full_name)}
                        </Avatar>
                      </Badge>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="600" noWrap>
                          {user.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last active: {getRelativeTime(user.last_login)}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === "admin" ? "primary" : "default"}
                      />
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
