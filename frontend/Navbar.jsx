import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Jobs", path: "/jobs" },
];

export default function Navbar({ user, onLogout, searchQuery, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchKey = (e) => {
    if (e.key === "Enter") navigate("/jobs");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav-link { transition: color .15s; text-decoration: none; }
        .nav-link:hover { color: #0F6E56 !important; }
        .search-input::placeholder { color: #A8A29E; }
        .search-input:focus { outline: none; box-shadow: none; }
        .user-menu { position: relative; }
        .dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #FDFAF5; border: 1px solid #E8E3D9; border-radius: 12px;
          padding: 6px; min-width: 180px; box-shadow: 0 8px 24px rgba(0,0,0,.1);
          z-index: 100;
        }
        .dropdown-item {
          display: block; padding: 8px 12px; font-size: 14px; color: #57534E;
          border-radius: 8px; cursor: pointer; text-decoration: none;
          transition: background .1s;
        }
        .dropdown-item:hover { background: #F5F0E8; color: #1C1917; }
      `}</style>

      <nav
        style={{
          background: "#1C1410",
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #2A2118",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#0F6E56",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 19,
                color: "#F5EFE3",
                letterSpacing: "-0.01em",
              }}
            >
              Second Chapter
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-link"
                style={{
                  fontSize: 14,
                  fontWeight: isActive(link.path) ? 600 : 400,
                  color: isActive(link.path) ? "#0F6E56" : "#A8A29E",
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: isActive(link.path) ? "#0F6E5615" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search bar — centered, grows */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#2A2118",
              border: "1px solid #3D3530",
              borderRadius: 10,
              padding: "0 14px",
              height: 40,
              gap: 8,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" stroke="#78716C" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="search-input"
              placeholder="Search jobs, skills, location..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#F5EFE3",
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#78716C",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Auth area */}
          {user ? (
            <div className="user-menu">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  background: "#2A2118",
                  border: "1px solid #3D3530",
                  borderRadius: 10,
                  padding: "6px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: "#F5EFE3",
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "#0F6E56",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name?.split(" ")[0]}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="m6 9 6 6 6-6" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <div
                    className="dropdown-item"
                    style={{ color: "#D85A30" }}
                    onClick={() => { onLogout(); setMenuOpen(false); }}
                  >
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Link to="/login">
                <Button
                  style={{
                    background: "transparent",
                    color: "#A8A29E",
                    border: "1px solid #3D3530",
                    borderRadius: 8,
                    fontSize: 13,
                    padding: "6px 14px",
                    height: "auto",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  style={{
                    background: "#0F6E56",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    padding: "6px 14px",
                    height: "auto",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Removed duplicate filter bar for /jobs */}
      </nav>
    </>
  );
}
