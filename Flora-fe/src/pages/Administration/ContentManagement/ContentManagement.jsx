import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  useTheme,
  alpha,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  RecordVoiceOver,
  Quiz,
  ArrowBack,
  ChevronRight,
  Search,
  MoreVert,
  Settings,
  ContentCopy,
  DragIndicator,
  CheckCircle,
  HelpOutline,
  KeyboardArrowRight,
  Class,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import userService from "~/services/userService";
import { useNotification } from "~/contexts/NotificationContext";

// Glassmorphism Component
const GlassPaper = ({ children, sx = {}, ...props }) => {
  const theme = useTheme();
  return (
    <Paper
      {...props}
      sx={{
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.05)}`,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default function ContentManagement() {
  const theme = useTheme();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGlobalView, setIsGlobalView] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Situations/Questions
  const [topTab, setTopTab] = useState(0); // 0: Groups, 1: Global Quizzes

  const [situations, setSituations] = useState([]);
  const [globalQuizzes, setGlobalQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    group_number: "",
    description: "",
    color_hex: "#2196F3",
    text: "",
    title: "",
    explanation: "",
    lesson_number: "",
    instruction_number: "",
    group_id: "",
    question: "",
    quiz_number: "",
    best_choice_id: "A",
    detailed_explanation: "",
    choices: [
      { choice_id: "A", text: "", rating: "best" },
      { choice_id: "B", text: "", rating: "acceptable" },
      { choice_id: "C", text: "", rating: "acceptable" },
    ],
  });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const gRes = await userService.getAdminGroups();
      setGroups(gRes.data || []);
    } catch (error) {
      console.error("Fetch groups error:", error);
      showNotification("Failed to fetch administrative groups", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchGlobalQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const qRes = await userService.getAdminQuizzes(null, true);
      setGlobalQuizzes(qRes.data || []);
    } catch (error) {
      showNotification("Failed to fetch global quizzes", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchGroupDetails = useCallback(
    async (groupId) => {
      setLoading(true);
      try {
        const qRes = await userService.getAdminQuizzes(groupId);
        setSituations(qRes.data || []);
      } catch (error) {
        console.error("Fetch details error:", error);
        showNotification("Failed to fetch group content", "error");
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  useEffect(() => {
    if (topTab === 0) fetchGroups();
    else fetchGlobalQuizzes();
  }, [topTab, fetchGroups, fetchGlobalQuizzes]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    fetchGroupDetails(group.id);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setSituations([]);
    setActiveTab(0);
    fetchGroups();
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditItem(item);

    if (item) {
      setFormData({
        ...item,
        title: item.title || "",
        explanation: item.explanation || "",
        quiz_number: item.quiz_number || item.situation_number || (type === "quiz" ? globalQuizzes.length + 1 : situations.length + 1),
        best_choice_id: item.best_choice_id || "A",
        detailed_explanation: item.detailed_explanation || item.explanation || "",
        choices: item.choices || [
          { choice_id: "A", text: "", rating: "best" },
          { choice_id: "B", text: "", rating: "acceptable" },
          { choice_id: "C", text: "", rating: "acceptable" },
        ],
      });
    } else {
      setFormData({
        name: "",
        group_number: groups.length + 1,
        description: "",
        color_hex: "#2196F3",
        text: "",
        title: "",
        explanation: "",
        group_id: selectedGroup?.id || null,
        question: "",
        quiz_number: type === "quiz" ? globalQuizzes.length + 1 : situations.length + 1,
        best_choice_id: "A",
        detailed_explanation: "",
        choices: [
          { choice_id: "A", text: "", rating: "best" },
          { choice_id: "B", text: "", rating: "acceptable" },
          { choice_id: "C", text: "", rating: "acceptable" },
        ],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleSave = async () => {
    try {
      if (dialogType === "group") {
        if (editItem) await userService.updateGroup(editItem.id, formData);
        else await userService.createGroup(formData);
        fetchGroups();
      } else if (dialogType === "situation" || dialogType === "quiz") {
        const payload = {
          ...formData,
          group_id: dialogType === "quiz" ? null : selectedGroup.id,
          // Sync legacy naming if needed
          situation_number: formData.quiz_number,
          explanation: formData.detailed_explanation || formData.explanation
        };
        if (editItem) await userService.updateQuiz(editItem.id, payload);
        else await userService.createQuiz(payload);

        if (dialogType === "quiz") fetchGlobalQuizzes();
        else fetchGroupDetails(selectedGroup.id);
      }

      showNotification("Saved successfully", "success");
      handleCloseDialog();
    } catch (error) {
      console.error("Save error:", error);
      showNotification(`Failed to save ${dialogType}`, "error");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure? Soft delete will hide this ${type}.`)) return;
    try {
      if (type === "group") await userService.deleteGroup(id);
      else if (type === "situation" || type === "quiz") await userService.deleteQuiz(id);

      showNotification("Soft-deleted successfully", "success");
      if (type === "group") fetchGroups();
      else if (type === "quiz") fetchGlobalQuizzes();
      else fetchGroupDetails(selectedGroup.id);
    } catch (error) {
      showNotification(`Failed to delete ${type}`, "error");
    }
  };

  const filteredSituations = useMemo(() => {
    const list = topTab === 1 ? globalQuizzes : situations;
    return list.filter(s =>
      s.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topTab, globalQuizzes, situations, searchTerm]);

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Breadcrumbs separator={<ChevronRight sx={{ opacity: 0.5 }} fontSize="small" />}>
            <Link
              component="button"
              underline="hover"
              color={selectedGroup ? "text.secondary" : "primary"}
              onClick={handleBackToGroups}
              sx={{ fontWeight: selectedGroup ? 500 : 800, fontSize: "1rem", border: "none", background: "none", p: 0, cursor: "pointer" }}
            >
              Content Management
            </Link>
            {selectedGroup && (
              <Typography color="text.primary" sx={{ fontWeight: 800, fontSize: "1rem" }}>
                {selectedGroup.name}
              </Typography>
            )}
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="900" sx={{ mt: 1, color: "text.primary" }}>
            {selectedGroup ? selectedGroup.name : "Curriculum & Challenges"}
          </Typography>
        </Box>

        {!selectedGroup && (
          <Tabs value={topTab} onChange={(_, val) => setTopTab(val)} sx={{ bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 2, px: 2 }}>
            <Tab label="Course Groups" sx={{ fontWeight: 700 }} />
            <Tab label="Global Challenge Quizzes" sx={{ fontWeight: 700 }} />
          </Tabs>
        )}
      </Box>

      <AnimatePresence mode="wait">
        {!selectedGroup ? (
          <motion.div key={topTab === 0 ? "groups" : "global"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {topTab === 0 ? (
              <>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" color="text.secondary">Manage structured curriculum groups and their contents.</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("group")} sx={{ borderRadius: 2, fontWeight: 700 }}>New Group</Button>
                </Box>
                <Grid container spacing={3}>
                  {groups.map((group, idx) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={group.id}>
                      <GlassPaper sx={{ p: 0, overflow: "hidden", position: "relative", opacity: group.is_active ? 1 : 0.6 }}>
                        {!group.is_active && <Chip label="Inactive" size="small" sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }} />}
                        <Box sx={{ h: 100, bgcolor: alpha(group.color_hex || "#000", 0.1), p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: group.color_hex, fontWeight: 900 }}>{group.group_number}</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="800" noWrap>{group.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{group.description?.substring(0, 40)}...</Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleOpenDialog("group", group)}><Edit fontSize="small" /></IconButton>
                        </Box>
                        <Box sx={{ p: 3, cursor: "pointer" }} onClick={() => handleGroupClick(group)}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Curriculum Content</Typography>
                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete("group", group.id); }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <Chip label={`${group.situation_count || 0} Quizzes`} size="small" variant="outlined" />
                          </Box>
                        </Box>
                      </GlassPaper>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" color="text.secondary">Manage quizzes that are not tied to any specific group.</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("quiz")} sx={{ borderRadius: 2, fontWeight: 700 }}>New Global Quiz</Button>
                </Box>
                <Grid container spacing={3}>
                  {globalQuizzes.map((quiz, idx) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={quiz.id}>
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, position: "relative", opacity: quiz.is_active ? 1 : 0.6 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Chip label={`Quiz #${quiz.quiz_number}`} size="small" color="primary" />
                          <Box>
                            <IconButton size="small" onClick={() => handleOpenDialog("quiz", quiz)}><Edit fontSize="small" /></IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete("quiz", quiz.id)}><Delete fontSize="small" /></IconButton>
                          </Box>
                        </Box>
                        <Typography variant="h6" fontWeight="800" gutterBottom>{quiz.question}</Typography>
                        <Typography variant="caption" color="text.secondary">Best Answer: {quiz.choices?.find(c => c.choice_id === quiz.best_choice_id)?.text || "N/A"}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassPaper sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                  <Tab label="Situations/Quizzes" icon={<Quiz />} iconPosition="start" />
                </Tabs>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField size="small" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("situation")}>
                    Add Situation
                  </Button>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ p: 3, minHeight: 400 }}>
                <Grid container spacing={2}>
                  {filteredSituations.map((item, idx) => (
                    <Grid size={{ xs: 12 }} key={item.id}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 900, minWidth: 40, mt: 0.5 }}>#{item.quiz_number || idx + 1}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem' }}>{item.question}</Typography>

                          {(item.explanation || item.detailed_explanation) && (
                            <Box sx={{ mt: 1, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 1.5, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                              <Typography variant="caption" fontWeight="800" color="primary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Explanation</Typography>
                              <Typography variant="body2" color="text.secondary">{item.explanation || item.detailed_explanation}</Typography>
                            </Box>
                          )}

                          {item.choices && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{item.choices.length} choices available</Typography>}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton size="small" onClick={() => handleOpenDialog("situation", item)}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete("situation", item.id)}><Delete fontSize="small" /></IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </GlassPaper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>{editItem ? "Edit" : "Create"} {dialogType}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            {dialogType === "group" && (
              <>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField label="Group #" type="number" sx={{ w: 100 }} value={formData.group_number} onChange={(e) => setFormData({ ...formData, group_number: e.target.value })} />
                  <TextField label="Group Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Box>
                <TextField label="Description" multiline rows={3} fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <TextField label="Color Hex" fullWidth value={formData.color_hex} onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })} />
              </>
            )}
            {(dialogType === "situation" || dialogType === "quiz") && (
              <>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField label="Quiz #" type="number" sx={{ w: 100 }} value={formData.quiz_number} onChange={(e) => setFormData({ ...formData, quiz_number: e.target.value })} />
                  <FormControl fullWidth>
                    <InputLabel>Best Choice</InputLabel>
                    <Select value={formData.best_choice_id} onChange={(e) => setFormData({ ...formData, best_choice_id: e.target.value })}>
                      <MenuItem value="A">Choice A</MenuItem>
                      <MenuItem value="B">Choice B</MenuItem>
                      <MenuItem value="C">Choice C</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField label="Question/Situation" fullWidth multiline rows={2} value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
                <Typography variant="subtitle2">Response Choices</Typography>
                {formData.choices.map((choice, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar sx={{ w: 30, h: 30, fontSize: 12, bgcolor: formData.best_choice_id === choice.choice_id ? "success.main" : "grey.300" }}>{choice.choice_id}</Avatar>
                    <TextField fullWidth size="small" placeholder={`Choice ${choice.choice_id} text...`} value={choice.text} onChange={(e) => {
                      const nc = [...formData.choices];
                      nc[i].text = e.target.value;
                      setFormData({ ...formData, choices: nc });
                    }} />
                  </Box>
                ))}
                <TextField label="Detailed Explanation" fullWidth multiline rows={3} value={formData.detailed_explanation} onChange={(e) => setFormData({ ...formData, detailed_explanation: e.target.value })} />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

