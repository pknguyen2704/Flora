import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  School,
  RecordVoiceOver,
  Quiz,
  ArrowBack,
  ChevronRight,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import userService from "~/services/userService";
import { useNotification } from "~/contexts/NotificationContext";

export default function ContentManagement() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [instructions, setInstructions] = useState([]);
  const [situations, setSituations] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'group', 'instruction', 'situation'
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    group_number: "",
    description: "",
    color_hex: "#2196F3",
    text: "",
    instruction_number: "",
    group_id: "",
    title: "",
    situation_number: "",
    choices: [
      { choice_id: "A", text: "", rating: "best", explanation: "" },
      { choice_id: "B", text: "", rating: "acceptable", explanation: "" },
      { choice_id: "C", text: "", rating: "not_recommended", explanation: "" },
    ],
  });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const gRes = await userService.getGroups();
      setGroups(gRes.data.groups);
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
        setInstructions(iRes.data);

        const sRes = await userService.getAdminSituations(groupId);
        setSituations(sRes.data);
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
    fetchGroups();
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditItem(item);

    if (item) {
      setFormData({
        ...formData,
        ...item,
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
        group_id: selectedGroup?.id || groups[0]?.id || "",
        title: "",
        situation_number: situations.length + 1,
        choices: [
          { choice_id: "A", text: "", rating: "best", explanation: "" },
          { choice_id: "B", text: "", rating: "acceptable", explanation: "" },
          {
            choice_id: "C",
            text: "",
            rating: "not_recommended",
            explanation: "",
          },
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
        if (editItem)
          await userService.updateInstruction(editItem.id, formData);
        else await userService.createInstruction(formData);
        fetchGroupDetails(selectedGroup.id);
      } else if (dialogType === "situation") {
        const payload = { ...formData, description: formData.title };
        if (editItem) await userService.updateSituation(editItem.id, payload);
        else await userService.createSituation(payload);
        fetchGroupDetails(selectedGroup.id);
      }

      showNotification(
        `${
          dialogType.charAt(0).toUpperCase() + dialogType.slice(1)
        } saved successfully`,
        "success"
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Save error:", error);
      showNotification(`Failed to save ${dialogType}`, "error");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;
    try {
      if (type === "group") {
        await userService.deleteGroup(id);
        fetchGroups();
      } else if (type === "instruction") {
        await userService.deleteInstruction(id);
        fetchGroupDetails(selectedGroup.id);
      } else if (type === "situation") {
        await userService.deleteSituation(id);
        fetchGroupDetails(selectedGroup.id);
      }
      showNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
        "success"
      );
    } catch (error) {
      showNotification(`Failed to delete ${type}`, "error");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Breadcrumbs / Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        {selectedGroup && (
          <IconButton onClick={handleBackToGroups} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
        )}
        <Box>
          <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
            <Link
              component="button"
              underline="hover"
              color={selectedGroup ? "text.secondary" : "text.primary"}
              onClick={handleBackToGroups}
              sx={{
                fontWeight: selectedGroup ? 500 : 700,
                fontSize: "1.5rem",
                border: "none",
                background: "none",
                p: 0,
                cursor: "pointer",
              }}
            >
              Groups
            </Link>
            {selectedGroup && (
              <Typography
                color="text.primary"
                sx={{ fontWeight: 700, fontSize: "1.5rem" }}
              >
                {selectedGroup.name}
              </Typography>
            )}
          </Breadcrumbs>
          <Typography variant="body2" color="text.secondary">
            {selectedGroup
              ? `Manage instructions and situations for ${selectedGroup.name}`
              : "Manage training groups and their contents"}
          </Typography>
        </Box>
      </Box>

      {loading && !selectedGroup ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AnimatePresence mode="wait">
          {!selectedGroup ? (
            <motion.div
              key="groups-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog("group")}
                >
                  Add Group
                </Button>
              </Box>
              <Grid container spacing={3}>
                {groups.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: group.color_hex,
                          boxShadow: `0 8px 24px ${group.color_hex}25`,
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={() => handleGroupClick(group)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: group.color_hex,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            {group.group_number}
                          </Box>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog("group", group);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete("group", group.id);
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                          {group.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            minHeight: "3em",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {group.description || "No description provided."}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={`${group.instruction_count || 0} Inst.`}
                            size="small"
                            variant="outlined"
                            icon={<RecordVoiceOver fontSize="small" />}
                          />
                          <Chip
                            label={`${group.situation_count || 0} Situ.`}
                            size="small"
                            variant="outlined"
                            icon={<Quiz fontSize="small" />}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              key="group-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Grid container spacing={4}>
                {/* Instructions Section */}
                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight="700">
                        Instructions
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog("instruction")}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ m: "auto", py: 4 }} />
                      ) : (
                        instructions.map((inst) => (
                          <Card
                            key={inst.id}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          >
                            <CardContent sx={{ py: "12px !important" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="primary"
                                  fontWeight="700"
                                >
                                  #{inst.instruction_number}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {inst.text}
                                </Typography>
                                <Box sx={{ display: "flex" }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDialog("instruction", inst)
                                    }
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDelete("instruction", inst.id)
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                      )}
                      {!loading && instructions.length === 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No instructions in this group.
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                {/* Situations Section */}
                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight="700">
                        Situations
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog("situation")}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ m: "auto", py: 4 }} />
                      ) : (
                        situations.map((sit) => (
                          <Card
                            key={sit.id}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          >
                            <CardContent sx={{ py: "12px !important" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="secondary"
                                  fontWeight="700"
                                >
                                  #{sit.situation_number}
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="600">
                                    {sit.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    noWrap
                                    sx={{ maxWidth: 200 }}
                                  >
                                    {sit.description}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex" }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDialog("situation", sit)
                                    }
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDelete("situation", sit.id)
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                      )}
                      {!loading && situations.length === 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No situations in this group.
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add/Edit Dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 800 }}>
              {editItem ? "Edit" : "Add"}{" "}
              {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
            </DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 3 }}
              >
                {dialogType === "group" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          label="Group Name"
                          fullWidth
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Group Number"
                          type="number"
                          fullWidth
                          value={formData.group_number || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              group_number: parseInt(e.target.value) || "",
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <TextField
                      label="Color (Hex)"
                      placeholder="#FF6B6B"
                      fullWidth
                      value={formData.color_hex || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, color_hex: e.target.value })
                      }
                    />
                  </>
                )}
                {dialogType === "instruction" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Instruction Number"
                          type="number"
                          fullWidth
                          value={formData.instruction_number || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instruction_number:
                                parseInt(e.target.value) || "",
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          label="Group"
                          fullWidth
                          disabled
                          value={selectedGroup?.name || "No group selected"}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Instruction Text"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.text || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                    />
                  </>
                )}
                {dialogType === "situation" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Situation Number"
                          type="number"
                          fullWidth
                          value={formData.situation_number || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              situation_number: parseInt(e.target.value) || "",
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          label="Group"
                          fullWidth
                          disabled
                          value={selectedGroup?.name || "No group selected"}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Title / Description"
                      fullWidth
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <Typography variant="subtitle2" fontWeight="700">
                      Quiz Choices
                    </Typography>
                    {formData.choices?.map((choice, index) => (
                      <Paper
                        key={choice.choice_id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" fontWeight="800">
                            Choice {choice.choice_id}
                          </Typography>
                          <FormControl size="small" sx={{ width: 150 }}>
                            <Select
                              value={choice.rating || "best"}
                              onChange={(e) => {
                                const newChoices = [...formData.choices];
                                newChoices[index].rating = e.target.value;
                                setFormData({
                                  ...formData,
                                  choices: newChoices,
                                });
                              }}
                            >
                              <MenuItem value="best">Best</MenuItem>
                              <MenuItem value="acceptable">Acceptable</MenuItem>
                              <MenuItem value="not_recommended">
                                Not Recommended
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <TextField
                          label="Text"
                          fullWidth
                          size="small"
                          value={choice.text || ""}
                          onChange={(e) => {
                            const newChoices = [...formData.choices];
                            newChoices[index].text = e.target.value;
                            setFormData({ ...formData, choices: newChoices });
                          }}
                        />
                        <TextField
                          label="Feedback Explanation"
                          fullWidth
                          size="small"
                          multiline
                          rows={2}
                          value={choice.explanation || ""}
                          onChange={(e) => {
                            const newChoices = [...formData.choices];
                            newChoices[index].explanation = e.target.value;
                            setFormData({ ...formData, choices: newChoices });
                          }}
                        />
                      </Paper>
                    ))}
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
                {editItem ? "Update" : "Save"}{" "}
                {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
}
