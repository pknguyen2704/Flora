import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { store } from "~/redux/store";
import { AuthProvider } from "~/contexts/AuthContext";
import { NotificationProvider } from "~/contexts/NotificationContext";
import { SidebarProvider } from "~/contexts/SidebarContext";
import ProtectedRoute from "~/components/shared/ProtectedRoute";
import theme from "~/theme";

// Pages
import Introduction from "~/pages/Introduction/Introduction";
import Login from "~/pages/Login/Login";
import Home from "~/pages/Home/Home";
import Groups from "~/pages/Instructions/Instructions";
import GroupDetail from "~/pages/Instructions/Group/Group";
import PronunciationPractice from "~/pages/Instructions/Group/PronunciationPractice/PronunciationPractice";
import CustomPronunciation from "~/pages/CustomPronunciation/CustomPronunciation";
import SituationQuiz from "~/pages/Instructions/Group/Situation/SituationQuiz";

// Admin Pages
import Administration from "~/pages/Administration/Administration";
import ContentManagement from "~/pages/Administration/ContentManagement/ContentManagement";

// Shared Components
import RootRedirect from "~/components/shared/RootRedirect";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <SidebarProvider>
              <Routes>
                {/* Root route - smart redirect based on auth */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public routes */}
                <Route path="/introduction" element={<Introduction />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instruction-practice"
                  element={
                    <ProtectedRoute>
                      <Groups />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/group/:id"
                  element={
                    <ProtectedRoute>
                      <GroupDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pronunciation/:groupId"
                  element={
                    <ProtectedRoute>
                      <PronunciationPractice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pronunciation/:groupId/:instructionId"
                  element={
                    <ProtectedRoute>
                      <PronunciationPractice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instruction/custom"
                  element={
                    <ProtectedRoute>
                      <CustomPronunciation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/situations/quiz/:groupId"
                  element={
                    <ProtectedRoute>
                      <SituationQuiz />
                    </ProtectedRoute>
                  }
                />
                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Administration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <ProtectedRoute>
                      <ContentManagement />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<h1>404 - Not Found</h1>} />
              </Routes>
            </SidebarProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
