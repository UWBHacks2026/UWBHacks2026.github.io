import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import JobListingPage from "./pages/JobListingPage";

export default function App() {
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "#F5EFE3",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Routes>
          {/* Login — no navbar */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* All other routes — with navbar */}
          <Route
            path="*"
            element={
              <>
                <Navbar
                  user={user}
                  onLogout={handleLogout}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                />
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route
                    path="/jobs"
                    element={<JobListingPage searchQuery={searchQuery} />}
                  />
                  <Route
                    path="/profile"
                    element={
                      user ? (
                        <ProfilePage user={user} />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
