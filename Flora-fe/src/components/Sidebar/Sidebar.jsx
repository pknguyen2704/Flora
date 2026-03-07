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
import { motion } from "framer-motion";

const Sidebar = React.memo(function Sidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize menu items
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
    if (path === "/instruction/custom") return "custom-instruction";
    if (path.startsWith("/learning")) return "learning";
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
      component={motion.div}
      layout
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
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }
      }}
    >
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentActiveSection === item.id;
          const menuButton = (
            <ListItemButton
              component={motion.div}
              layout
              disableGutters
              onClick={() => handleItemClick(item)}
              whileHover={isActive ? undefined : {
                x: collapsed ? 0 : 4,
                backgroundColor: "rgba(79, 70, 229, 0.08)"
              }}
              whileTap={{ scale: 0.98 }}
              sx={{
                borderRadius: 1.5,
                py: 1.5,
                px: collapsed ? 1.5 : 2,
                mb: 1,
                background: isActive
                  ? "var(--mui-palette-primary-main)"
                  : "transparent",
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                transition: "color 0.2s ease",
                position: "relative",
                overflow: "hidden",
                justifyContent: collapsed ? "center" : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.main", // Keep same color on hover when selected
                  },
                },
              }}
              selected={isActive}
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
                  <Box sx={{ width: '100%' }}>
                    {menuButton}
                  </Box>
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
