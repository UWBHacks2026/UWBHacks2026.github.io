import { BrowserRouter, useNavigate, useLocation, Link as RouterLink, Routes, Route, Navigate, Link } from "react-router-dom";
import { Navbar } from "@repo/ui/components/navbar";
import { useState } from "react";
import { LoginPage } from "@repo/ui/views/LoginView";
import { DashboardPage } from "@repo/ui/views/DashboardView";
import { JobListingPage } from "@repo/ui/views/JobListingView";
import { ProfilePage } from "@repo/ui/views/ProfileView";
import { AuthProvider } from "@repo/ui/components/AuthContext";

function AppContent() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    });
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogin = (userData: any) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      navigate("/");
    }

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem("user");
    }

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />

        {/* Wrapper for routes with Navbar */}
        <Route path="*" element={
          <div className="min-h-screen bg-brand-bg flex flex-col">
            <Navbar
              user={user}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              LinkComponent={Link}
            />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<DashboardPage LinkComponent={Link} />} />
                <Route path="/jobs" element={<JobListingPage searchQuery={searchQuery} />} />
                <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}