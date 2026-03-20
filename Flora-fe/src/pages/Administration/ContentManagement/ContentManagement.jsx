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
  const [activeTab, setActiveTab] = useState(0); // 0: Quizzes

  const [situations, setSituations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    group_number: "",
    description: "",
    color_hex: "#2196F3",
    is_active: true,
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
    fetchGroups();
  }, [fetchGroups]);

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
        quiz_number: item.quiz_number || item.situation_number || situations.length + 1,
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
        is_active: true,
        text: "",
        title: "",
        explanation: "",
        group_id: selectedGroup?.id || null,
        question: "",
        quiz_number: situations.length + 1,
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
      } else if (dialogType === "situation") {
        const payload = {
          ...formData,
          group_id: selectedGroup.id,
          // Sync legacy naming if needed
          situation_number: formData.quiz_number,
          explanation: formData.detailed_explanation || formData.explanation
        };
        if (editItem) await userService.updateQuiz(editItem.id, payload);
        else await userService.createQuiz(payload);

        fetchGroupDetails(selectedGroup.id);
      }

      showNotification("Saved successfully", "success");
      handleCloseDialog();
    } catch (error) {
      console.error("Save error:", error);
      showNotification(`Failed to save ${dialogType}`, "error");
    }
  };

  const handleToggleActive = async (type, item) => {
    try {
      const newStatus = !item.is_active;
      if (type === "group") {
        await userService.updateGroup(item.id, { is_active: newStatus });
        fetchGroups();
      } else if (type === "situation") {
        await userService.updateQuiz(item.id, { is_active: newStatus });
        fetchGroupDetails(selectedGroup.id);
      }
      showNotification(`Set to ${newStatus ? "Active" : "Inactive"}`, "success");
    } catch (error) {
      showNotification("Failed to toggle status", "error");
    }
  };

  const handleHardDelete = async (type, id) => {
    if (!window.confirm(`WARNING: This is a HARD DELETE. It will permanently remove this ${type} and all its content from the database. Are you sure?`)) return;
    try {
      if (type === "group") await userService.deleteGroup(id);
      else if (type === "situation") await userService.deleteQuiz(id);

      showNotification("Deleted permanently", "success");
      if (type === "group") fetchGroups();
      else fetchGroupDetails(selectedGroup.id);
    } catch (error) {
      showNotification(`Failed to delete ${type}`, "error");
    }
  };

  const filteredSituations = useMemo(() => {
    return situations.filter(s =>
      s.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [situations, searchTerm]);

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
            {selectedGroup ? selectedGroup.name : "Content Management"}
          </Typography>
        </Box>
      </Box>

      <AnimatePresence mode="wait">
        {!selectedGroup ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" color="text.secondary">Manage structured curriculum groups and their contents.</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("group")} sx={{ borderRadius: 2, fontWeight: 700 }}>New Group</Button>
            </Box>
            <Grid container spacing={3}>
              {groups.map((group, idx) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={group.id}>
                  <GlassPaper sx={{ p: 0, overflow: "hidden", position: "relative", border: group.is_active ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{
                      bgcolor: group.is_active ? alpha(group.color_hex || theme.palette.primary.main, 0.08) : alpha(theme.palette.grey[500], 0.05),
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                      <Avatar sx={{ bgcolor: group.is_active ? (group.color_hex || theme.palette.primary.main) : theme.palette.grey[400], fontWeight: 900, width: 40, height: 40 }}>{group.group_number}</Avatar>
                      <Box sx={{ flex: 1, overflow: "hidden" }}>
                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2, wordBreak: 'break-word', mb: 0.5 }}>{group.name}</Typography>
                        <Chip
                          label={group.is_active ? "Active" : "Inactive"}
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem', 
                            fontWeight: 800, 
                            textTransform: 'uppercase',
                            bgcolor: group.is_active ? 'primary.main' : 'grey.400',
                            color: 'white',
                            border: 'none',
                          }}
                        />
                      </Box>
                      <Tooltip title="Edit Group">
                        <IconButton size="small" onClick={() => handleOpenDialog("group", group)} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                    </Box>
                    <Box sx={{ p: 2.5, cursor: "pointer", "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }} onClick={() => handleGroupClick(group)}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2, minHeight: 40 }}>
                        {group.description || "No description provided."}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip icon={<Quiz sx={{ fontSize: '1rem !important' }} />} label={`${group.situation_count || group.quiz_count || 0} Quizzes`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title={group.is_active ? "Soft Deactivate" : "Soft Activate"}>
                            <IconButton 
                              size="small" 
                              color={group.is_active ? "primary" : "default"} 
                              onClick={(e) => { e.stopPropagation(); handleToggleActive("group", group); }}
                              sx={{ bgcolor: group.is_active ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1) }}
                            >
                              <Settings fontSize="small" sx={{ animation: group.is_active ? 'spin 10s linear infinite' : 'none', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hard Delete (Permanent)">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={(e) => { e.stopPropagation(); handleHardDelete("group", group.id); }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </GlassPaper>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassPaper sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                  <Tab label="Quizzes" icon={<Quiz />} iconPosition="start" />
                </Tabs>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField size="small" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("situation")}>
                    Add New Quiz
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Tooltip title={item.is_active ? "Deactivate" : "Activate"}>
                            <IconButton 
                              size="small" 
                              color={item.is_active ? "primary" : "default"} 
                              onClick={() => handleToggleActive("situation", item)}
                              sx={{ border: '1px solid', borderColor: 'divider' }}
                            >
                              <CheckCircle fontSize="small" sx={{ opacity: item.is_active ? 1 : 0.3 }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={() => handleOpenDialog("situation", item)}><Edit fontSize="small" /></IconButton>
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
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField label="Group #" type="number" sx={{ width: 100 }} value={formData.group_number} onChange={(e) => setFormData({ ...formData, group_number: e.target.value })} />
                  <TextField label="Group Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.is_active}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField label="Description" multiline rows={3} fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <TextField label="Color Hex" fullWidth value={formData.color_hex} onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })} />
              </>
            )}
            {dialogType === "situation" && (
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

