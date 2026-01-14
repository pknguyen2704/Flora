import { Navigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not logged in, redirect to introduction
  return <Navigate to="/introduction" replace />;
}
