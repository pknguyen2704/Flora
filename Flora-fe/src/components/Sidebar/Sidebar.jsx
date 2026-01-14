import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically determine active section from current path if not provided
  const determineActiveSection = () => {
    if (activeSection) return activeSection;

    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get("section");

    if (path === "/home") {
      return section || "overview";
    }
    if (path === "/instruction/custom") return "custom-instruction";
    if (
      path === "/instruction-practice" ||
      path.startsWith("/group/") ||
      path.startsWith("/pronunciation/") ||
      path.startsWith("/situations/")
    )
      return "groups";
    return "overview";
  };

  const currentActiveSection = determineActiveSection();

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <HomeIcon />,
      type: "section",
      path: "/home",
    },
    {
      id: "custom-instruction",
      label: "Custom Instruction",
      icon: <MicIcon />,
      type: "link",
      path: "/instruction/custom",
    },
    {
      id: "groups",
      label: "Instruction Practice",
      icon: <SchoolIcon />,
      type: "section",
      path: "/instruction-practice",
    },
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 280,
        height: (theme) => theme.flora.contentHeight,
        // position: "fixed",
        left: 0,
        top: 64, // Position below AppBar
        // backdropFilter: "blur(10px)",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        px: collapsed ? 1 : 2,
        py: 3,
        zIndex: 1000,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      {/* Navigation Menu */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentActiveSection === item.id;
          const menuButton = (
            <ListItemButton
              component={motion.div}
              disableGutters
              disableRipple
              whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.type === "link") {
                  navigate(item.path);
                } else if (onSectionChange) {
                  // For sections, update state and navigate with query param
                  onSectionChange(item.id);
                  navigate(item.path);
                } else {
                  // Fallback to just navigation
                  navigate(item.path);
                }
              }}
              sx={{
                borderRadius: 1,
                py: 1.5,
                px: collapsed ? 1.5 : 2,
                mb: 1,
                background: isActive
                  ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                  : "transparent",
                color: isActive ? "white" : "text.primary",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                justifyContent: collapsed ? "center" : "flex-start",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                    : "rgba(0, 82, 212, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "primary.main",
                  minWidth: collapsed ? "auto" : 40,
                  justifyContent: "center",
                  border: "none",
                  outline: "none",
                  "& .MuiSvgIcon-root": {
                    border: "none",
                    outline: "none",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.id} disablePadding>
              {collapsed ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {menuButton}
                </Tooltip>
              ) : (
                menuButton
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
