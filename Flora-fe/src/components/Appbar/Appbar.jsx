import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ArrowBack,
  Language as LanguageIcon,
  Check as CheckIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useAuth } from "~/contexts/AuthContext";
import { useNotification } from "~/contexts/NotificationContext";
import logo_white from "~/assets/logo_white.svg";

export default function Appbar({
  showBack = true,
  sidebarCollapsed,
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("en"); // Default to English
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const langName = lang === "en" ? "English" : "Tiếng Việt";
    showNotification(`Language changed to ${langName}`, "success");
    // TODO: Implement actual language change logic for the entire app
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login");
    showNotification("Logged out successfully", "info");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.username?.slice(0, 2).toUpperCase() || "U";
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === "/home";

  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0052D4 0%, #0035A0 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        {/* Sidebar Toggle Button */}
        {onToggleSidebar && (
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={onToggleSidebar}
            edge="start"
            sx={{
              mr: 2,
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
          <img src={logo_white} alt="Flora Logo" style={{ height: "56px" }} />
        </Box>

        {/* User Info & Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", md: "block" },
              fontWeight: 500,
              color: "inherit",
            }}
          >
            Hi, {user?.full_name}
          </Typography>

          <IconButton
            onClick={handleAvatarClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              transition: "all 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "white",
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "2px solid",
                borderColor: "primary.light",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "secondary.main",
                },
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 8px 32px rgba(0,0,0,0.15))",
                width: 280,
                borderRadius: "24px", // Explicit 24px for controlled roundness
                mt: 1.5,
                background: "#FFFFFF",
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.08)",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 24, // Moved slightly left to avoid corner curve
                  width: 12,
                  height: 12,
                  bgcolor: "#0052D4", // Match gradient start color
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          MenuListProps={{
            disablePadding: true, // Fixes the white gap at the top
          }}
        >
          {/* User Info Header with Gradient */}
          <Box
            sx={{
              p: 3,
              pb: 3,
              mb: 1,
              background: "linear-gradient(135deg, #0052D4 0%, #4364F7 100%)",
              color: "white",
              borderTopLeftRadius: "24px", // Match Paper borderRadius
              borderTopRightRadius: "24px", // Match Paper borderRadius
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {getInitials()}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="700"
                  sx={{
                    color: "white",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "1rem",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.full_name || user?.username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  Student
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box sx={{ px: 2, pb: 2 }}>
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: "16px", // Consistent rounded items
                px: 2,
                py: 1.5,
                color: "error.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "error.lighter",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  transform: "translateY(-2px)", // Subtle lift instead of slide
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "error.main",
                }}
              >
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              />
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
}
