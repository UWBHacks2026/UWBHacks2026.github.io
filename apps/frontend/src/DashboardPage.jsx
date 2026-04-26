import { Link } from "react-router-dom";
import { Button } from "components/ui/button";

const STATS = [
  { num: "240+", label: "Open Positions" },
  { num: "80+", label: "Volunteer Roles" },
  { num: "150+", label: "Partner Employers" },
  { num: "1,200+", label: "People Placed" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Build a full resume — work history, skills, and education — that tells your complete story on your terms.",
    color: "#0F6E56",
  },
  {
    step: "02",
    title: "Browse Opportunities",
    desc: "Search hundreds of jobs and volunteer roles from employers who specifically want to give you a fair shot.",
    color: "#BA7517",
  },
  {
    step: "03",
    title: "Apply with Confidence",
    desc: "Every employer on our platform has committed to fair-chance hiring. No hidden hurdles.",
    color: "#534AB7",
  },
];

const FEATURED = [
  {
    title: "Warehouse Associate",
    org: "Sunrise Logistics Co.",
    location: "Chicago, IL",
    pay: "$18–21/hr",
    type: "job",
    color: "#0F6E56",
    initials: "SL",
    tags: ["Entry Level", "Benefits"],
  },
  {
    title: "Peer Mentor",
    org: "Pathways Forward",
    location: "Los Angeles, CA",
    pay: "Volunteer + Stipend",
    type: "volunteer",
    color: "#993556",
    initials: "PF",
    tags: ["Youth", "Mentorship"],
  },
  {
    title: "Construction Laborer",
    org: "BuildRight Contractors",
    location: "Phoenix, AZ",
    pay: "$22–26/hr",
    type: "job",
    color: "#534AB7",
    initials: "BR",
    tags: ["OSHA Training", "Union Eligible"],
  },
];

const VALUES = [
  { icon: "🤝", title: "Dignity First", desc: "We believe every person deserves to be seen for their potential, not reduced to their past." },
  { icon: "🔓", title: "Radical Transparency", desc: "Employers on our platform have signed a fair-chance pledge. No surprises at the final stage." },
  { icon: "🌱", title: "Long-term Support", desc: "We don't just match you to a job. We provide resources for lasting stability and growth." },
];

export default function DashboardPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F5EFE3" }}>

        {/* ── Hero ── */}
        <section
          style={{
            background: "#1C1410",
            padding: "80px 24px 88px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative rings */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", border: "1px solid #0F6E5615", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", border: "1px solid #0F6E5608", pointerEvents: "none" }} />

          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            <span
              style={{
                display: "inline-block",
                background: "#BA751718",
                border: "1px solid #BA751730",
                color: "#BA7517",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 20,
                marginBottom: 24,
              }}
            >
              Fair-chance employment & volunteering
            </span>

            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 400,
                color: "#F5EFE3",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 22,
              }}
            >
              Your next chapter{" "}
              <em style={{ color: "#0F6E56" }}>starts now</em>
            </h1>

            <p
              style={{
                fontSize: "clamp(15px, 2vw, 17px)",
                color: "#A8A29E",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 520,
                margin: "0 auto 36px",
              }}
            >
              Skill Bridge connects people with skills to jobs and communities that need their talents.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/jobs">
                <Button
                  style={{
                    background: "#0F6E56",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    padding: "13px 28px",
                    height: "auto",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Browse Opportunities →
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  style={{
                    background: "transparent",
                    color: "#F5EFE3",
                    border: "1px solid #3D3530",
                    borderRadius: 10,
                    fontSize: 15,
                    padding: "13px 28px",
                    height: "auto",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Create Free Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section style={{ background: "#221A14", padding: "32px 24px", borderBottom: "1px solid #2A2118" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 24,
              textAlign: "center",
            }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 36,
                    color: "#F5EFE3",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </p>
                <p style={{ fontSize: 13, color: "#78716C", margin: "6px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#BA7517", textTransform: "uppercase", marginBottom: 12 }}>
              Simple & transparent
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 400,
                color: "#1C1917",
                margin: 0,
              }}
            >
              How Skill Bridge works
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "#FDFAF5",
                  border: "1px solid #E8E3D9",
                  borderRadius: 18,
                  padding: "32px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 64,
                    color: step.color + "15",
                    position: "absolute",
                    top: 12,
                    right: 20,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.step}
                </span>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: step.color + "18",
                    border: `1.5px solid ${step.color}30`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: step.color,
                    }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#1C1917",
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.7, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured listings preview ── */}
        <section style={{ background: "#221A14", padding: "72px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 36,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#BA7517", textTransform: "uppercase", marginBottom: 10 }}>
                  Featured this week
                </p>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(24px, 3.5vw, 36px)",
                    fontWeight: 400,
                    color: "#F5EFE3",
                    margin: 0,
                  }}
                >
                  Opportunities waiting for you
                </h2>
              </div>
              <Link to="/jobs">
                <Button
                  style={{
                    background: "transparent",
                    color: "#0F6E56",
                    border: "1px solid #0F6E5640",
                    borderRadius: 9,
                    fontSize: 13,
                    padding: "8px 18px",
                    height: "auto",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  View all →
                </Button>
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {FEATURED.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "#2A2118",
                    border: "1px solid #3D3530",
                    borderRadius: 16,
                    padding: "22px",
                    cursor: "pointer",
                    transition: "border-color .15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: item.color + "20",
                        border: `1.5px solid ${item.color}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'DM Serif Display', serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: item.color,
                      }}
                    >
                      {item.initials}
                    </div>
                    <span
                      style={{
                        background: item.type === "job" ? "#0F6E5618" : "#3B6D1118",
                        color: item.type === "job" ? "#0F6E56" : "#639922",
                        border: `1px solid ${item.type === "job" ? "#0F6E5630" : "#3B6D1130"}`,
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.type === "job" ? "Job" : "Volunteer"}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 17,
                      fontWeight: 400,
                      color: "#F5EFE3",
                      margin: "0 0 4px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#78716C", margin: "0 0 10px" }}>{item.org}</p>
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#A8A29E", marginBottom: 14 }}>
                    <span>📍 {item.location}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: "#3D3530",
                          color: "#A8A29E",
                          borderRadius: 20,
                          fontSize: 11,
                          padding: "2px 9px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#0F6E56" }}>{item.pay}</span>
                    <Link to="/jobs">
                      <Button
                        style={{
                          background: "#0F6E56",
                          color: "#fff",
                          border: "none",
                          borderRadius: 7,
                          fontSize: 12,
                          padding: "5px 14px",
                          height: "auto",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Apply →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our values ── */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#BA7517", textTransform: "uppercase", marginBottom: 12 }}>
              What we stand for
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 400,
                color: "#1C1917",
                margin: 0,
              }}
            >
              Built on respect & opportunity
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#FDFAF5",
                  border: "1px solid #E8E3D9",
                  borderRadius: 16,
                  padding: "28px 24px",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }}>{v.icon}</div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 19,
                    fontWeight: 400,
                    color: "#1C1917",
                    marginBottom: 10,
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          style={{
            background: "#0F6E56",
            padding: "72px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "#F5EFE3",
              marginBottom: 16,
            }}
          >
            Ready to write your next chapter?
          </h2>
          <p style={{ fontSize: 15, color: "#9FE1CB", marginBottom: 32, lineHeight: 1.7 }}>
            Join over 1,200 people who found new beginnings through Second Chapter.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login">
              <Button
                style={{
                  background: "#F5EFE3",
                  color: "#0F6E56",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "13px 28px",
                  height: "auto",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button
                style={{
                  background: "transparent",
                  color: "#F5EFE3",
                  border: "1px solid #9FE1CB60",
                  borderRadius: 10,
                  fontSize: 15,
                  padding: "13px 28px",
                  height: "auto",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Browse Without Signing Up
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: "#1C1410", padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#57534E", margin: 0 }}>
            © 2025 Second Chapter. Built with care for those rebuilding.
          </p>
        </footer>
      </div>
    </>
  );
}
