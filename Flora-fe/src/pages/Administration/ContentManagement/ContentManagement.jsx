import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  School,
  RecordVoiceOver,
  Quiz,
  Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Appbar from "~/components/AppBar/Appbar";
import Footer from "~/components/footer/Footer";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ContentManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'group', 'instruction', 'situation'

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType("");
  };

  // Mock data
  const groups = [
    {
      id: 1,
      name: "Classroom Basics",
      group_number: 1,
      color_hex: "#FF6B6B",
      instruction_count: 20,
      situation_count: 15,
    },
    {
      id: 2,
      name: "Advanced Instructions",
      group_number: 2,
      color_hex: "#4ECDC4",
      instruction_count: 25,
      situation_count: 18,
    },
  ];

  const instructions = [
    {
      id: 1,
      instruction_number: 1,
      text: "Open your books to page 42",
      difficulty_level: "beginner",
      group_id: 1,
    },
    {
      id: 2,
      instruction_number: 2,
      text: "Please work in pairs",
      difficulty_level: "intermediate",
      group_id: 1,
    },
  ];

  const situations = [
    {
      id: 1,
      situation_number: 1,
      description: "Student asks to go to bathroom",
      correct_instruction_id: 1,
      group_id: 1,
    },
  ];

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Appbar />

      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mb: 4 }}
          >
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Content Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage groups, instructions, and situations
            </Typography>
          </Box>

          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              <Tab icon={<School />} label="Groups" iconPosition="start" />
              <Tab
                icon={<RecordVoiceOver />}
                label="Instructions"
                iconPosition="start"
              />
              <Tab icon={<Quiz />} label="Situations" iconPosition="start" />
            </Tabs>

            {/* Groups Tab */}
            <TabPanel value={tabValue} index={0}>
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
                        "&:hover": {
                          borderColor: group.color_hex,
                          boxShadow: `0 8px 16px ${group.color_hex}20`,
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: group.color_hex,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                        >
                          {group.group_number}
                        </Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {group.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Chip
                            label={`${group.instruction_count} Instructions`}
                            size="small"
                          />
                          <Chip
                            label={`${group.situation_count} Situations`}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Instructions Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog("instruction")}
                >
                  Add Instruction
                </Button>
              </Box>

              <Grid container spacing={2}>
                {instructions.map((instruction) => (
                  <Grid item xs={12} key={instruction.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Chip label={`#${instruction.instruction_number}`} />
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {instruction.text}
                          </Typography>
                          <Chip
                            label={instruction.difficulty_level}
                            size="small"
                            color="primary"
                          />
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Situations Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog("situation")}
                >
                  Add Situation
                </Button>
              </Box>

              <Grid container spacing={2}>
                {situations.map((situation) => (
                  <Grid item xs={12} key={situation.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Chip label={`#${situation.situation_number}`} />
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {situation.description}
                          </Typography>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {dialogType === "group" && (
              <>
                <TextField label="Group Name" fullWidth />
                <TextField label="Group Number" type="number" fullWidth />
                <TextField
                  label="Color (Hex)"
                  placeholder="#FF6B6B"
                  fullWidth
                />
              </>
            )}
            {dialogType === "instruction" && (
              <>
                <TextField
                  label="Instruction Text"
                  fullWidth
                  multiline
                  rows={3}
                />
                <FormControl fullWidth>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select label="Difficulty Level">
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select label="Group">
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {dialogType === "situation" && (
              <>
                <TextField
                  label="Situation Description"
                  fullWidth
                  multiline
                  rows={3}
                />
                <FormControl fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select label="Group">
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Container>
  );
}
