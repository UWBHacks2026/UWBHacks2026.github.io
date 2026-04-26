import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

/* ✅ FIX: moved outside so inputs don’t lose focus */
function Field({ id, label, type = "text", placeholder, error, value, onChange, onSubmit }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#57534E", marginBottom: 6 }}
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        style={{
          background: "#FDFAF5",
          border: `1px solid ${error ? "#D85A30" : "#E8E3D9"}`,
          borderRadius: 10,
          fontSize: 14,
          color: "#1C1917",
          height: 44,
          width: "100%",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "none",
          outline: "none",
        }}
      />
      {error && (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#D85A30" }}>{error}</p>
      )}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (mode === "signup" && !form.name.trim()) errs.name = "Name is required";
    if (!form.email.includes("@")) errs.email = "Enter a valid email";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (mode === "signup" && form.password !== form.confirm)
      errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      onLogin({
        name: mode === "signup" ? form.name : form.email.split("@")[0],
        email: form.email,
      });
      navigate("/");
    }, 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #A8A29E; }
        input:focus { outline: none !important; box-shadow: none !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#1C1410",
          display: "flex",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              bottom: -120,
              left: -80,
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "#0F6E5610",
              border: "1px solid #0F6E5625",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 80,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "#BA751708",
              border: "1px solid #BA751720",
            }}
          />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#0F6E56",
                borderRadius: 10,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22,
                color: "#F5EFE3",
              }}
            >
              Second Chapter
            </span>
          </div>

          {/* Headline */}
          <div>
            <p style={{ fontSize: 11, color: "#BA7517", marginBottom: 20 }}>
              YOUR FRESH START BEGINS HERE
            </p>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "#F5EFE3",
              }}
            >
              Every person deserves a{" "}
              <em style={{ color: "#0F6E56" }}>second chance</em> to thrive.
            </h1>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "min(480px, 100%)",
            background: "#F5EFE3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 48px",
          }}
        >
          {/* Toggle */}
          <div
            style={{
              display: "flex",
              background: "#EDE8DF",
              borderRadius: 12,
              padding: 4,
              marginBottom: 32,
            }}
          >
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 9,
                  border: mode === m ? "1px solid #E8E3D9" : "none",
                  background: mode === m ? "#FDFAF5" : "transparent",
                  color: mode === m ? "#1C1917" : "#78716C",
                  fontWeight: mode === m ? 600 : 400,
                  cursor: "pointer",
                }}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          {mode === "signup" && (
            <Field
              id="name"
              label="Full Name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onSubmit={handleSubmit}
              error={errors.name}
            />
          )}

          <Field
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onSubmit={handleSubmit}
            error={errors.email}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onSubmit={handleSubmit}
            error={errors.password}
          />

          {mode === "signup" && (
            <Field
              id="confirm"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onSubmit={handleSubmit}
              error={errors.confirm}
            />
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#78716C" : "#0F6E56",
              color: "#fff",
              borderRadius: 10,
              padding: "13px",
              marginTop: 8,
            }}
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </div>
    </>
  );
}