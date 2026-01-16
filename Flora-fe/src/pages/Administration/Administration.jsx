import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Container,
} from "@mui/material";
import {
  People,
  Dashboard as DashboardIcon,
  Article,
} from "@mui/icons-material";
import Appbar from "~/components/AppBar/Appbar";
import Footer from "~/components/footer/Footer";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import ContentManagement from "./ContentManagement/ContentManagement";
import UserManagement from "./UserManagement/UserManagement";

const DRAWER_WIDTH = 260;

export default function Administration() {
  const [selectedSection, setSelectedSection] = useState("users");

  const menuItems = [
    { id: "users", label: "User Management", icon: <People /> },
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "content", label: "Content", icon: <Article /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "users":
        return <UserManagement />;
      case "dashboard":
        return <AdminDashboard />;
      case "content":
        return <ContentManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Appbar />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              position: "relative",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Administration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Panel
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedSection === item.id}
                  onClick={() => setSelectedSection(item.id)}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selectedSection === item.id ? "white" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, bgcolor: "background.default" }}>
          <Container maxWidth="xl">{renderContent()}</Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
