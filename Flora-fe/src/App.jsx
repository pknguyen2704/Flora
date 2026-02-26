import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "~/redux/store";
import { AuthProvider } from "~/contexts/AuthContext";
import { NotificationProvider } from "~/contexts/NotificationContext";
import { SidebarProvider } from "~/contexts/SidebarContext";
import ProtectedRoute from "~/components/shared/ProtectedRoute";
import theme from "~/theme";

// Lazy load pages for code splitting
const Introduction = lazy(() => import("~/pages/Introduction/Introduction"));
const Login = lazy(() => import("~/pages/Login/Login"));
const Home = lazy(() => import("~/pages/Home/Home"));
const Groups = lazy(() => import("~/pages/Instructions/Instructions"));
const PronunciationPractice = lazy(() => import("~/pages/Instructions/PronunciationPractice/PronunciationPractice"));
const CustomPronunciation = lazy(() => import("~/pages/CustomPronunciation/CustomPronunciation"));
import SituationQuiz from "~/pages/Quiz/Situation/SituationQuiz";
const Administration = lazy(() => import("~/pages/Administration/Administration"));
const ContentManagement = lazy(() => import("~/pages/Administration/ContentManagement/ContentManagement"));
import Quiz from "~/pages/Quiz/Quiz";
const QuizContent = lazy(() => import("~/pages/Quiz/Content/Content"));

// Shared Components (not lazy loaded as they're always needed)
import RootRedirect from "~/components/shared/RootRedirect";

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      bgcolor: "background.default",
    }}
  >
    <CircularProgress size={48} />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <SidebarProvider>
              <Suspense fallback={<LoadingScreen />}>
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

                  <Route
                    path="/quiz"
                    element={
                      <ProtectedRoute>
                        <Quiz />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/quiz/content/:groupId"
                    element={
                      <ProtectedRoute>
                        <QuizContent />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
              </Suspense>
            </SidebarProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
