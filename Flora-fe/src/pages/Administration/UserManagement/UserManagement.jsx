import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Drawer,
  Grid,
  Avatar,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Mic,
  Quiz,
  CalendarToday,
  Close,
  Search,
  Add,
} from "@mui/icons-material";
import userService from "~/services/userService";
import { useNotification } from "~/contexts/NotificationContext";
import { formatLocalDate, getRelativeTime } from "~/utils/timeUtils";

const STATS_DRAWER_WIDTH = 600;
const ROWS_PER_PAGE = 10;

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

//  Helper function to get color for avatar
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


export default function UserManagement() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      showNotification(
        error.response?.data?.detail || "Failed to fetch users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply filters
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((user) =>
        statusFilter === "active" ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(result);
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, roleFilter, statusFilter, users]);

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username || "",
      fullname: user.full_name || "",
      email: user.email || "",
      role: user.role || "user",
      password: "",
      confirmPassword: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditFormData({
      username: "",
      fullname: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
  };

  const handleEditSubmit = () => {
    // Validate passwords match if provided
    if (
      editFormData.password &&
      editFormData.password !== editFormData.confirmPassword
    ) {
      showNotification("Passwords do not match", "error");
      return;
    }

    // Show confirmation dialog
    setUpdateConfirmOpen(true);
  };

  const handleUpdateConfirm = async () => {
    try {
      setUpdateConfirmOpen(false);
      const updateData = {
        fullname: editFormData.fullname,
        email: editFormData.email,
        role: editFormData.role,
      };

      // Only include password if provided
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await userService.updateUser(selectedUser.id, updateData);
      showNotification("User updated successfully", "success");
      handleEditClose();
      fetchUsers();
    } catch (error) {
      showNotification(
        error.response?.data?.detail || "Failed to update user",
        "error"
      );
    }
  };

  const handleDeleteOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      showNotification("User deleted successfully", "success");
      handleDeleteClose();
      fetchUsers();
    } catch (error) {
      showNotification(
        error.response?.data?.detail || "Failed to delete user",
        "error"
      );
    }
  };

  const handleCreateOpen = () => {
    setCreateFormData({
      username: "",
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateSubmit = async () => {
    // Validate passwords match
    if (createFormData.password !== createFormData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      await userService.createUser({
        username: createFormData.username,
        email: createFormData.email,
        fullname: createFormData.fullname,
        password: createFormData.password,
        role: createFormData.role,
      });
      showNotification("User created successfully", "success");
      handleCreateClose();
      fetchUsers();
    } catch (error) {
      showNotification(
        error.response?.data?.detail || "Failed to create user",
        "error"
      );
    }
  };

  const handleViewStats = () => {
    // Navigate to Administration panel with dashboard tab
    // The dashboard tab is the default, so just navigate there
    // User can search for this user in the dashboard
    window.location.hash = "/administration";
  };

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );
  const pageCount = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);

  const getStatusChip = (isActive) => {
    if (isActive) {
      return (
        <Chip
          label="Active"
          color="success"
          size="small"
          sx={{ fontWeight: 600, minWidth: 80 }}
        />
      );
    }
    return (
      <Chip
        label="Inactive"
        color="default"
        size="small"
        sx={{ fontWeight: 600, minWidth: 80 }}
      />
    );
  };

  const getRoleChip = (role) => {
    const isAdmin = role === "admin";
    return (
      <Chip
        label={isAdmin ? "Admin" : "User"}
        color={isAdmin ? "primary" : "default"}
        size="small"
        sx={{ fontWeight: 600, minWidth: 80 }}
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all users in one place. Control access, assign roles, and
          monitor activity across your platform.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOpen}
          sx={{ textTransform: "none" }}
        >
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Joined Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last Active</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: getAvatarColor(user.full_name),
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(user.full_name)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="600">
                          {user.full_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(user.is_active)}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatLocalDate(user.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {getRelativeTime(user.last_login || user.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => handleEditOpen(user)}
                          sx={{ color: "primary.main" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteOpen(user)}
                          sx={{ color: "error.main" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}
          >
            <TextField
              fullWidth
              label="Username"
              value={editFormData.username}
              disabled
              helperText="Username cannot be changed"
            />
            <TextField
              fullWidth
              label="Full Name"
              value={editFormData.fullname}
              onChange={(e) =>
                setEditFormData({ ...editFormData, fullname: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role}
                label="Role"
                onChange={(e) =>
                  setEditFormData({ ...editFormData, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Reset Password (Optional)
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                gutterBottom
                display="block"
                sx={{ mb: 2 }}
              >
                Leave blank to keep current password
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={editFormData.password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, password: e.target.value })
                }
                sx={{ mb: 2 }}
                helperText="Minimum 5 characters"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={editFormData.confirmPassword}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
          Create New User
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}
          >
            <TextField
              fullWidth
              label="Username"
              value={createFormData.username}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  username: e.target.value,
                })
              }
              helperText="Unique username for login (minimum 3 characters)"
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              value={createFormData.fullname}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  fullname: e.target.value,
                })
              }
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={createFormData.email}
              onChange={(e) =>
                setCreateFormData({ ...createFormData, email: e.target.value })
              }
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={createFormData.role}
                label="Role"
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Set Password
              </Typography>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={createFormData.password}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    password: e.target.value,
                  })
                }
                sx={{ mb: 2, mt: 2 }}
                helperText="Minimum 5 characters"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={createFormData.confirmPassword}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateSubmit}
            disabled={
              !createFormData.username ||
              !createFormData.email ||
              !createFormData.fullname ||
              !createFormData.password ||
              !createFormData.confirmPassword ||
              createFormData.username.length < 3 ||
              createFormData.password.length < 5
            }
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog
        open={updateConfirmOpen}
        onClose={() => setUpdateConfirmOpen(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Are you sure you want to update user{" "}
          <strong>{selectedUser?.full_name}</strong>?
          {editFormData.password && (
            <Box
              sx={{ mt: 2, p: 2, bgcolor: "warning.lighter", borderRadius: 1 }}
            >
              <Typography variant="body2" color="warning.dark">
                ⚠️ This will reset the user's password.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateConfirm}>
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedUser?.full_name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
