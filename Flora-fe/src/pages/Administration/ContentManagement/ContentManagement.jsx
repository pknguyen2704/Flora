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
  const [activeTab, setActiveTab] = useState(0); // 0: Instructions, 1: Situations

  const [instructions, setInstructions] = useState([]);
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
    text: "",
    instruction_number: "",
    group_id: "",
    question: "",
    situation_number: "",
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
      const gRes = await userService.getGroups();
      setGroups(gRes.data.groups || []);
    } catch (error) {
      console.error("Fetch groups error:", error);
      showNotification("Failed to fetch groups", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchGroupDetails = useCallback(
    async (groupId) => {
      setLoading(true);
      try {
        const iRes = await userService.getAdminInstructions(groupId);
        setInstructions(iRes.data || []);

        const sRes = await userService.getAdminSituations(groupId);
        setSituations(sRes.data || []);
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
    setInstructions([]);
    setSituations([]);
    setActiveTab(0);
    fetchGroups();
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditItem(item);

    if (item) {
      setFormData({
        ...formData,
        ...item,
        best_choice_id: item.best_choice_id || "A",
        detailed_explanation: item.detailed_explanation || "",
        choices: item.choices || formData.choices,
      });
    } else {
      setFormData({
        name: "",
        group_number: groups.length + 1,
        description: "",
        color_hex: "#2196F3",
        text: "",
        instruction_number: instructions.length + 1,
        group_id: selectedGroup?.id || "",
        question: "",
        situation_number: situations.length + 1,
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
      } else if (dialogType === "instruction") {
        const payload = { ...formData, group_id: selectedGroup.id };
        if (editItem) await userService.updateInstruction(editItem.id, payload);
        else await userService.createInstruction(payload);
        fetchGroupDetails(selectedGroup.id);
      } else if (dialogType === "situation") {
        const payload = {
          ...formData,
          group_id: selectedGroup.id,
          title: formData.question // Backward compatibility if needed
        };
        if (editItem) await userService.updateSituation(editItem.id, payload);
        else await userService.createSituation(payload);
        fetchGroupDetails(selectedGroup.id);
      }

      showNotification("Saved successfully", "success");
      handleCloseDialog();
    } catch (error) {
      console.error("Save error:", error);
      showNotification(`Failed to save ${dialogType}`, "error");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}? This action cannot be undone.`)) return;
    try {
      if (type === "group") await userService.deleteGroup(id);
      else if (type === "instruction") await userService.deleteInstruction(id);
      else if (type === "situation") await userService.deleteSituation(id);

      showNotification("Deleted successfully", "success");
      if (type === "group") fetchGroups();
      else fetchGroupDetails(selectedGroup.id);
    } catch (error) {
      showNotification(`Failed to delete ${type}`, "error");
    }
  };

  const filteredInstructions = useMemo(() => {
    return instructions.filter(i =>
      i.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [instructions, searchTerm]);

  const filteredSituations = useMemo(() => {
    return situations.filter(s =>
      s.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [situations, searchTerm]);

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Breadcrumbs separator={<ChevronRight sx={{ opacity: 0.5 }} fontSize="small" />}>
            <Link
              component="button"
              underline="hover"
              color={selectedGroup ? "text.secondary" : "primary"}
              onClick={handleBackToGroups}
              sx={{ fontWeight: selectedGroup ? 500 : 800, fontSize: "1rem", border: "none", background: "none", p: 0, cursor: "pointer" }}
            >
              Content CMS
            </Link>
            {selectedGroup && (
              <Typography color="text.primary" sx={{ fontWeight: 800, fontSize: "1rem" }}>
                {selectedGroup.name}
              </Typography>
            )}
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="900" sx={{ mt: 1, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {selectedGroup ? selectedGroup.name : "Platform Curriculum"}
          </Typography>
        </Box>

        {!selectedGroup && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            onClick={() => handleOpenDialog("group")}
            sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 700, textTransform: "none" }}
          >
            Create New Group
          </Button>
        )}
      </Box>

      <AnimatePresence mode="wait">
        {!selectedGroup ? (
          <motion.div
            key="groups-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Grid container spacing={3}>
              {groups.map((group, index) => (
                <Grid item xs={12} sm={6} lg={4} key={group.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassPaper
                      sx={{
                        p: 0,
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 20px 40px ${alpha(group.color_hex || "#000", 0.15)}`,
                          borderColor: group.color_hex,
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: 80,
                          bgcolor: alpha(group.color_hex || "#000", 0.1),
                          display: "flex",
                          alignItems: "center",
                          px: 3,
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        <Box sx={{ position: "absolute", right: -20, top: -20, opacity: 0.1 }}>
                          <Class sx={{ fontSize: 120, color: group.color_hex }} />
                        </Box>
                        <Avatar sx={{ bgcolor: group.color_hex, fontWeight: 900, boxShadow: 3 }}>
                          {group.group_number}
                        </Avatar>
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <Typography variant="h6" fontWeight="800" noWrap>
                            {group.name}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog("group", group); }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ p: 3 }} onClick={() => handleGroupClick(group)} style={{ cursor: "pointer" }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {group.description || "No curriculum description available."}
                        </Typography>

                        <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Pronunciation Exercises">
                              <Chip size="small" icon={<RecordVoiceOver fontSize="small" />} label={group.instruction_count || 0} sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }} />
                            </Tooltip>
                            <Tooltip title="Quiz Situations">
                              <Chip size="small" icon={<Quiz fontSize="small" />} label={group.situation_count || 0} sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.secondary.main, 0.05) }} />
                            </Tooltip>
                          </Box>
                          <KeyboardArrowRight color="action" />
                        </Box>
                      </Box>
                    </GlassPaper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            key="group-detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
          >
            <GlassPaper sx={{ p: 0, mb: 4 }}>
              <Box sx={{ px: 3, pt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  sx={{
                    "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" }
                  }}
                >
                  <Tab icon={<RecordVoiceOver />} label="Pronunciation" iconPosition="start" sx={{ fontWeight: 700, px: 3 }} />
                  <Tab icon={<Quiz />} label="Quiz Situations" iconPosition="start" sx={{ fontWeight: 700, px: 3 }} />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    size="small"
                    placeholder="Quick search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 250 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" sx={{ opacity: 0.5 }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog(activeTab === 0 ? "instruction" : "situation")}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                  >
                    Add {activeTab === 0 ? "Instruction" : "Situation"}
                  </Button>
                </Box>
              </Box>
              <Divider />

              <Box sx={{ p: 4, minHeight: 400 }}>
                <AnimatePresence mode="wait">
                  {activeTab === 0 ? (
                    <motion.div key="inst-list" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <Grid container spacing={2}>
                        {filteredInstructions.map((inst, idx) => (
                          <Grid item xs={12} sm={6} lg={4} key={inst.id}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  transition: 'background 0.2s',
                                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: theme.palette.primary.main }
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ width: 40, color: 'primary.main', fontWeight: 900 }}>
                                  #{inst.instruction_number}
                                </Typography>
                                <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                                  {inst.text}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton size="small" onClick={() => handleOpenDialog("instruction", inst)}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" color="error" onClick={() => handleDelete("instruction", inst.id)}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                        {filteredInstructions.length === 0 && (
                          <Box sx={{ m: "auto", textAlign: "center", py: 8, width: "100%" }}>
                            <RecordVoiceOver sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                            <Typography color="text.secondary">No pronunciation instructions found.</Typography>
                          </Box>
                        )}
                      </Grid>
                    </motion.div>
                  ) : (
                    <motion.div key="sit-list" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                      <Grid container spacing={3}>
                        {filteredSituations.map((sit, idx) => (
                          <Grid item xs={12} sm={6} lg={4} key={sit.id}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 3,
                                  borderRadius: 2,
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  transition: 'all 0.2s',
                                  '&:hover': { borderColor: theme.palette.secondary.main, boxShadow: theme.shadows[2] }
                                }}
                              >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                  <Chip label={`#${sit.situation_number}`} size="small" color="secondary" sx={{ fontWeight: 900 }} />
                                  <Box>
                                    <IconButton size="small" onClick={() => handleOpenDialog("situation", sit)}>
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete("situation", sit.id)}>
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Typography variant="h6" fontWeight="800" gutterBottom>
                                  {sit.question}
                                </Typography>
                                <Box sx={{ mt: 'auto', pt: 2 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: 14, color: "success.main" }} />
                                    Best: {sit.choices?.find(c => c.choice_id === sit.best_choice_id)?.text || "Not set"}
                                  </Typography>
                                </Box>
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                        {filteredSituations.length === 0 && (
                          <Box sx={{ m: "auto", textAlign: "center", py: 8, width: "100%" }}>
                            <Quiz sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                            <Typography color="text.secondary">No quiz situations found.</Typography>
                          </Box>
                        )}
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </GlassPaper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Dialog Structure */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, px: 3, pt: 3 }}>
          {editItem ? "Refine" : "Create"}{" "}
          {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            {dialogType === "group" && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Curriculum Name"
                      fullWidth
                      variant="filled"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Sequence #"
                      type="number"
                      fullWidth
                      variant="filled"
                      value={formData.group_number || ""}
                      onChange={(e) => setFormData({ ...formData, group_number: parseInt(e.target.value) || "" })}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="filled"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    label="Accent Color (Hex)"
                    placeholder="#2196F3"
                    fullWidth
                    variant="filled"
                    value={formData.color_hex || ""}
                    onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                  />
                </Box>
              </>
            )}

            {dialogType === "instruction" && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Exercise #" type="number" fullWidth variant="filled" value={formData.instruction_number || ""} onChange={(e) => setFormData({ ...formData, instruction_number: parseInt(e.target.value) || "" })} />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField label="Parent Group" fullWidth disabled value={selectedGroup?.name || ""} variant="filled" />
                  </Grid>
                </Grid>
                <TextField
                  label="Phrasal Instruction Content"
                  fullWidth
                  multiline
                  rows={4}
                  variant="filled"
                  placeholder="e.g., Please open your book to page..."
                  value={formData.text || ""}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  InputProps={{ sx: { fontSize: '1.2rem', fontWeight: 500 } }}
                />
              </>
            )}

            {dialogType === "situation" && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Scene #" type="number" fullWidth variant="filled" value={formData.situation_number || ""} onChange={(e) => setFormData({ ...formData, situation_number: parseInt(e.target.value) || "" })} />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Best Response Strategy"
                      select
                      fullWidth
                      variant="filled"
                      value={formData.best_choice_id || "A"}
                      onChange={(e) => setFormData({ ...formData, best_choice_id: e.target.value })}
                    >
                      <MenuItem value="A">Choice A (Default)</MenuItem>
                      <MenuItem value="B">Choice B</MenuItem>
                      <MenuItem value="C">Choice C</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <TextField
                  label="What is the classroom situation?"
                  fullWidth
                  variant="filled"
                  placeholder="The class is noisy while you are explaining..."
                  value={formData.question || ""}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />

                <Typography variant="overline" color="text.secondary" sx={{ mt: 1 }}>Intervention Options</Typography>
                <Grid container spacing={2}>
                  {formData.choices?.map((choice, index) => (
                    <Grid item xs={12} key={choice.choice_id}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: formData.best_choice_id === choice.choice_id ? alpha(theme.palette.success.main, 0.05) : "transparent" }}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14, fontWeight: 900, bgcolor: formData.best_choice_id === choice.choice_id ? "success.main" : "grey.200" }}>{choice.choice_id}</Avatar>
                          <TextField
                            placeholder={`Response ${choice.choice_id}...`}
                            fullWidth
                            size="small"
                            value={choice.text || ""}
                            onChange={(e) => {
                              const newChoices = [...formData.choices];
                              newChoices[index].text = e.target.value;
                              setFormData({ ...formData, choices: newChoices });
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <TextField
                  label="Educational Rationale (Detailed Explanation)"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Explain why the best choice is most appropriate for a teacher in this context..."
                  value={formData.detailed_explanation || ""}
                  onChange={(e) => setFormData({ ...formData, detailed_explanation: e.target.value })}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={handleSave} sx={{ borderRadius: 2, px: 4, fontWeight: 900 }}>
            Commit Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
