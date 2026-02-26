import React, { useMemo, useCallback } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import MicIcon from "@mui/icons-material/Mic";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate, useLocation } from "react-router-dom";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
const Sidebar = React.memo(function Sidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize menu items - only recreate if icons change (never)
  const menuItems = useMemo(() => [
    {
      id: "overview",
      label: "Overview",
      icon: <HomeIcon />,
      type: "section",
      path: "/home",
    },
    // {
    //   id: "custom-instruction",
    //   label: "Custom Instruction",
    //   icon: <MicIcon />,
    //   type: "link",
    //   path: "/instruction/custom",
    // },
    // {
    //   id: "groups",
    //   label: "Instruction Pronunciation",
    //   icon: <RecordVoiceOverIcon />,
    //   type: "link",
    //   path: "/instruction-practice",
    // },
    {
      id: "learning",
      label: "Learning",
      icon: <SchoolIcon />,
      type: "link",
      path: "/learning",
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: <QuizIcon />,
      type: "link",
      path: "/quiz",
    },


  ], []);

  // Memoize active section determination
  const currentActiveSection = useMemo(() => {
    if (activeSection) return activeSection;

    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get("section");

    if (path === "/home") {
      return section || "overview";
    }
    if (path === "/home") {
      return section || "overview";
    }
    if (path === "/instruction/custom") return "custom-instruction";
    if (path.startsWith("/quiz") || path.startsWith("/situations/quiz")) return "quiz";
    if (
      path === "/instruction-practice" ||
      path.startsWith("/group/") ||
      path.startsWith("/pronunciation/") ||
      path.startsWith("/situations/")
    )
      return "groups";
    return "overview";
  }, [activeSection, location.pathname, location.search]);

  // Memoize click handler
  const handleItemClick = useCallback((item) => {
    if (item.type === "link") {
      navigate(item.path);
    } else if (onSectionChange) {
      onSectionChange(item.id);
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  }, [navigate, onSectionChange]);

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 280,
        height: (theme) => theme.flora.contentHeight,
        left: 0,
        top: 64,
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        px: collapsed ? 1 : 2,
        py: 3,
        zIndex: 1000,
        transition: "width 0.25s ease-out, padding 0.25s ease-out",
        overflow: "hidden",
        willChange: "width, padding",
        contain: "layout",
      }}
    >
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentActiveSection === item.id;
          const menuButton = (
            <ListItemButton
              disableGutters
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: 1,
                py: 1.5,
                px: collapsed ? 1.5 : 2,
                mb: 1,
                background: isActive
                  ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                  : "transparent",
                color: isActive ? "white" : "text.primary",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
                justifyContent: collapsed ? "center" : "flex-start",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(135deg, #0052D4 0%, #4A90E2 100%)"
                    : "rgba(0, 82, 212, 0.08)",
                  transform: collapsed ? "none" : "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "primary.main",
                  minWidth: collapsed ? "auto" : 40,
                  justifyContent: "center",
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
});

export default Sidebar;
