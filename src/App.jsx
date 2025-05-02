import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./Store/AuthContext";
import ProtectedRoute from "./components/PrivateRoute/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthContextProvider>
  );
}

export default App;