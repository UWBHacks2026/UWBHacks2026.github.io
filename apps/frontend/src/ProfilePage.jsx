/**
 * @typedef {Object} PersonalInfo
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} phone - User's phone number
 * @property {string} city - User's city
 * @property {string} state - User's state
 * @property {string} bio - User's bio/about me
 * @property {string} linkedin - LinkedIn or website URL
 */

/**
 * @typedef {Object} Job
 * @property {number} id - Unique identifier
 * @property {string} title - Job title
 * @property {string} employer - Employer/organization name
 * @property {string} start - Start date (MM/YYYY)
 * @property {string} end - End date (MM/YYYY or "Present")
 * @property {boolean} current - Whether this is current job
 * @property {string} description - Job description
 */

/**
 * @typedef {Object} Education
 * @property {number} id - Unique identifier
 * @property {string} school - School name
 * @property {string} degree - Degree type
 * @property {string} field - Field of study
 * @property {string} year - Graduation year
 */

/**
 * @typedef {Object} Reference
 * @property {number} id - Unique identifier
 * @property {string} name - Reference name
 * @property {string} relationship - Relationship to user
 * @property {string} phone - Reference phone
 * @property {string} email - Reference email
 */

/**
 * @typedef {Object} ProfilePageProps
 * @property {Object} [user] - User object from auth/login
 */

import { useState } from "react";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";


// ─── Reusable field components ───────────────────────────────────────────────

/**
 * Label component for form fields
 * @param {Object} props
 * @param {React.ReactNode} props.children - Label text
 * @returns {JSX.Element}
 */
const Label = ({ children }) => (
  <label
    style={{
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#57534E",
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    }}
  >
    {children}
  </label>
);

/**
 * TextField component for form inputs
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} [props.type="text"] - Input type
 * @param {boolean} [props.multiline=false] - Use textarea instead of input
 * @param {number} [props.rows=3] - Number of rows for textarea
 * @returns {JSX.Element}
 */
const TextField = ({ label, value, onChange, placeholder, type = "text", multiline, rows = 3 }) => (
  <div style={{ marginBottom: 20 }}>
    <Label>{label}</Label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          background: "#FDFAF5",
          border: "1px solid #E8E3D9",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 14,
          color: "#1C1917",
          fontFamily: "'DM Sans', sans-serif",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.6,
        }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#FDFAF5",
          border: "1px solid #E8E3D9",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 14,
          color: "#1C1917",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          height: 44,
        }}
      />
    )}
  </div>
);

/**
 * Section header component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} [props.action] - Optional action element (e.g., button)
 * @returns {JSX.Element}
 */
const SectionHeader = ({ title, subtitle, action }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 24,
      paddingBottom: 14,
      borderBottom: "1px solid #E8E3D9",
    }}
  >
    <div>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 22,
          fontWeight: 400,
          color: "#1C1917",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 13, color: "#A8A29E", margin: "4px 0 0" }}>{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

/**
 * Card container component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} [props.style={}] - Additional styles
 * @returns {JSX.Element}
 */
const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: "#FDFAF5",
      border: "1px solid #E8E3D9",
      borderRadius: 16,
      padding: "28px 32px",
      marginBottom: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Add button component for adding new items
 * @param {Object} props
 * @param {function} props.onClick - Click handler
 * @param {string} props.label - Button label text
 * @returns {JSX.Element}
 */
const AddButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      background: "#0F6E5612",
      color: "#0F6E56",
      border: "1.5px dashed #0F6E5640",
      borderRadius: 10,
      padding: "10px 0",
      fontSize: 13,
      fontWeight: 600,
      width: "100%",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginTop: 4,
    }}
  >
    + {label}
  </button>
);

/**
 * Remove button component for removing items
 * @param {Object} props
 * @param {function} props.onClick - Click handler
 * @returns {JSX.Element}
 */
const RemoveButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "#D85A3010",
      color: "#D85A30",
      border: "none",
      borderRadius: 7,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    Remove
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const blankJob = () => ({ id: Date.now(), title: "", employer: "", start: "", end: "", current: false, description: "" });
const blankEdu = () => ({ id: Date.now(), school: "", degree: "", field: "", year: "" });
const blankRef = () => ({ id: Date.now(), name: "", relationship: "", phone: "", email: "" });

export default function ProfilePage({ user }) {
  // Personal info
  const [personal, setPersonal] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    city: "",
    state: "",
    bio: "",
    linkedin: "",
  });

  // Skills
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // Work experience
  const [jobs, setJobs] = useState([blankJob()]);

  // Education
  const [education, setEducation] = useState([blankEdu()]);

  // References
  const [references, setReferences] = useState([blankRef()]);

  // UI state
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  const setP = (field) => (val) => setPersonal((p) => ({ ...p, [field]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((arr) => [...arr, s]);
    setSkillInput("");
  };

  const handleSave = () => {
    const updatedUser = {
      ...personal,
      skills,
      jobs,
      education,
      references,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };


  const updateItem = (list, setList, id, field, val) =>
    setList(list.map((item) => (item.id === id ? { ...item, [field]: val } : item)));

  const removeItem = (list, setList, id) =>
    setList(list.filter((item) => item.id !== id));

  const NAV_SECTIONS = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "references", label: "References" },
  ];

  const completionScore = () => {
    let score = 0;
    if (personal.name) score += 20;
    if (personal.bio) score += 15;
    if (personal.phone) score += 10;
    if (skills.length > 0) score += 20;
    if (jobs.some((j) => j.title)) score += 20;
    if (education.some((e) => e.school)) score += 15;
    return score;
  };

  const pct = completionScore();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #A8A29E; }
        input:focus, textarea:focus { border-color: #0F6E5680 !important; outline: none !important; box-shadow: none !important; }
        .section-nav-btn:hover { background: #F5F0E8 !important; }
      `}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px 80px", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 34,
              fontWeight: 400,
              color: "#1C1917",
              margin: "0 0 8px",
            }}
          >
            My Profile
          </h1>
          <p style={{ fontSize: 14, color: "#78716C", margin: 0 }}>
            Build your resume. Employers see this when you apply.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }}>

          {/* ── Sidebar ── */}
          <div style={{ position: "sticky", top: 88 }}>
            {/* Completion card */}
            <div
              style={{
                background: "#1C1410",
                borderRadius: 16,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 12, color: "#78716C", margin: "0 0 6px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Profile Strength
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#F5EFE3" }}>{pct}%</span>
                <span style={{ fontSize: 12, color: "#78716C" }}>complete</span>
              </div>
              <div style={{ background: "#3D3530", borderRadius: 20, height: 6, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: pct >= 80 ? "#0F6E56" : pct >= 50 ? "#BA7517" : "#D85A30",
                    borderRadius: 20,
                    transition: "width .4s ease",
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: "#78716C", margin: "10px 0 0", lineHeight: 1.5 }}>
                {pct < 50 ? "Add more info to improve visibility." : pct < 80 ? "Almost there! Add skills or references." : "Great profile! Employers can find you."}
              </p>
            </div>

            {/* Section nav */}
            <nav style={{ background: "#FDFAF5", border: "1px solid #E8E3D9", borderRadius: 14, padding: 6 }}>
              {NAV_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  className="section-nav-btn"
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: 9,
                    border: "none",
                    background: activeSection === sec.id ? "#0F6E5612" : "transparent",
                    color: activeSection === sec.id ? "#0F6E56" : "#57534E",
                    fontSize: 13,
                    fontWeight: activeSection === sec.id ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all .1s",
                  }}
                >
                  {sec.label}
                </button>
              ))}
            </nav>

            {/* Save button */}
            <Button
              onClick={handleSave}
              style={{
                width: "100%",
                marginTop: 16,
                background: saved ? "#0F6E56" : "#1C1917",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                padding: "12px",
                height: "auto",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background .2s",
              }}
            >
              {saved ? "✓ Saved!" : "Save Profile"}
            </Button>
          </div>

          {/* ── Main form area ── */}
          <div>

            {/* Personal Info */}
            <Card>
              <div id="personal">
                <SectionHeader
                  title="Personal Information"
                  subtitle="Your basic contact details"
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  <TextField label="Full Name" value={personal.name} onChange={setP("name")} placeholder="Your full name" />
                  <TextField label="Email" value={personal.email} onChange={setP("email")} placeholder="you@email.com" type="email" />
                  <TextField label="Phone Number" value={personal.phone} onChange={setP("phone")} placeholder="(555) 000-0000" type="tel" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                    <TextField label="City" value={personal.city} onChange={setP("city")} placeholder="Chicago" />
                    <TextField label="State" value={personal.state} onChange={setP("state")} placeholder="IL" />
                  </div>
                </div>
                <TextField label="LinkedIn / Website" value={personal.linkedin} onChange={setP("linkedin")} placeholder="linkedin.com/in/yourname" />
                <TextField
                  label="About Me"
                  value={personal.bio}
                  onChange={setP("bio")}
                  placeholder="Write 2–3 sentences about yourself, your goals, and what kind of work you're looking for..."
                  multiline
                  rows={4}
                />
              </div>
            </Card>

            {/* Work Experience */}
            <Card>
              <div id="experience">
                <SectionHeader
                  title="Work Experience"
                  subtitle="Include any paid or unpaid work, including prison jobs"
                />
                {jobs.map((job, idx) => (
                  <div
                    key={job.id}
                    style={{
                      marginBottom: idx < jobs.length - 1 ? 24 : 0,
                      paddingBottom: idx < jobs.length - 1 ? 24 : 0,
                      borderBottom: idx < jobs.length - 1 ? "1px solid #F0EBE1" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                        Position {idx + 1}
                      </p>
                      {jobs.length > 1 && <RemoveButton onClick={() => removeItem(jobs, setJobs, job.id)} />}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <TextField label="Job Title" value={job.title} onChange={(v) => updateItem(jobs, setJobs, job.id, "title", v)} placeholder="e.g. Warehouse Associate" />
                      <TextField label="Employer / Organization" value={job.employer} onChange={(v) => updateItem(jobs, setJobs, job.id, "employer", v)} placeholder="Company name" />
                      <TextField label="Start Date" value={job.start} onChange={(v) => updateItem(jobs, setJobs, job.id, "start", v)} placeholder="MM/YYYY" />
                      <TextField
                        label={job.current ? "End Date (Current)" : "End Date"}
                        value={job.current ? "Present" : job.end}
                        onChange={(v) => updateItem(jobs, setJobs, job.id, "end", v)}
                        placeholder="MM/YYYY or Present"
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, marginTop: -4 }}>
                      <input
                        type="checkbox"
                        id={`current-${job.id}`}
                        checked={job.current}
                        onChange={(e) => updateItem(jobs, setJobs, job.id, "current", e.target.checked)}
                        style={{ accentColor: "#0F6E56", width: 15, height: 15, cursor: "pointer" }}
                      />
                      <label htmlFor={`current-${job.id}`} style={{ fontSize: 13, color: "#57534E", cursor: "pointer" }}>
                        I currently work here
                      </label>
                    </div>
                    <TextField
                      label="Description"
                      value={job.description}
                      onChange={(v) => updateItem(jobs, setJobs, job.id, "description", v)}
                      placeholder="Briefly describe your responsibilities and accomplishments..."
                      multiline
                      rows={3}
                    />
                  </div>
                ))}
                <AddButton onClick={() => setJobs((j) => [...j, blankJob()])} label="Add Another Position" />
              </div>
            </Card>

            {/* Education */}
            <Card>
              <div id="education">
                <SectionHeader
                  title="Education"
                  subtitle="Include GEDs, trade programs, certificates, and college"
                />
                {education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    style={{
                      marginBottom: idx < education.length - 1 ? 24 : 0,
                      paddingBottom: idx < education.length - 1 ? 24 : 0,
                      borderBottom: idx < education.length - 1 ? "1px solid #F0EBE1" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                        Entry {idx + 1}
                      </p>
                      {education.length > 1 && <RemoveButton onClick={() => removeItem(education, setEducation, edu.id)} />}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <TextField label="School / Institution" value={edu.school} onChange={(v) => updateItem(education, setEducation, edu.id, "school", v)} placeholder="School or program name" />
                      <TextField label="Degree / Certificate" value={edu.degree} onChange={(v) => updateItem(education, setEducation, edu.id, "degree", v)} placeholder="e.g. GED, Associate's, Diploma" />
                      <TextField label="Field of Study" value={edu.field} onChange={(v) => updateItem(education, setEducation, edu.id, "field", v)} placeholder="e.g. Business, Welding, General" />
                      <TextField label="Year Completed" value={edu.year} onChange={(v) => updateItem(education, setEducation, edu.id, "year", v)} placeholder="YYYY or In Progress" />
                    </div>
                  </div>
                ))}
                <AddButton onClick={() => setEducation((e) => [...e, blankEdu()])} label="Add Another Entry" />
              </div>
            </Card>

            {/* Skills */}
            <Card>
              <div id="skills">
                <SectionHeader
                  title="Skills"
                  subtitle="Add skills you have — technical, soft, or trade-specific"
                />
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter..."
                    style={{
                      flex: 1,
                      background: "#FDFAF5",
                      border: "1px solid #E8E3D9",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#1C1917",
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      height: 44,
                    }}
                  />
                  <Button
                    onClick={addSkill}
                    style={{
                      background: "#0F6E56",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "0 20px",
                      height: 44,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Add
                  </Button>
                </div>

                {/* Skill suggestions */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 8 }}>Common skills — click to add:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Forklift", "Customer Service", "Microsoft Office", "Team Leadership", "Inventory Management", "CDL License", "Welding", "Carpentry", "Cooking", "Data Entry"].filter((s) => !skills.includes(s)).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSkills((arr) => [...arr, s])}
                        style={{
                          background: "transparent",
                          color: "#78716C",
                          border: "1px solid #E8E3D9",
                          borderRadius: 20,
                          fontSize: 12,
                          padding: "4px 11px",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          transition: "all .1s",
                        }}
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Added skills */}
                {skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: "#0F6E5612",
                          color: "#0F6E56",
                          border: "1px solid #0F6E5630",
                          borderRadius: 20,
                          fontSize: 13,
                          padding: "5px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {skill}
                        <button
                          onClick={() => setSkills((arr) => arr.filter((s) => s !== skill))}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0F6E56",
                            cursor: "pointer",
                            fontSize: 14,
                            lineHeight: 1,
                            padding: 0,
                            opacity: 0.7,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* References */}
            <Card>
              <div id="references">
                <SectionHeader
                  title="References"
                  subtitle="People who can vouch for your character or work"
                />
                {references.map((ref, idx) => (
                  <div
                    key={ref.id}
                    style={{
                      marginBottom: idx < references.length - 1 ? 24 : 0,
                      paddingBottom: idx < references.length - 1 ? 24 : 0,
                      borderBottom: idx < references.length - 1 ? "1px solid #F0EBE1" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                        Reference {idx + 1}
                      </p>
                      {references.length > 1 && <RemoveButton onClick={() => removeItem(references, setReferences, ref.id)} />}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <TextField label="Full Name" value={ref.name} onChange={(v) => updateItem(references, setReferences, ref.id, "name", v)} placeholder="Reference's name" />
                      <TextField label="Relationship" value={ref.relationship} onChange={(v) => updateItem(references, setReferences, ref.id, "relationship", v)} placeholder="e.g. Former Supervisor, Mentor" />
                      <TextField label="Phone Number" value={ref.phone} onChange={(v) => updateItem(references, setReferences, ref.id, "phone", v)} placeholder="(555) 000-0000" type="tel" />
                      <TextField label="Email Address" value={ref.email} onChange={(v) => updateItem(references, setReferences, ref.id, "email", v)} placeholder="their@email.com" type="email" />
                    </div>
                  </div>
                ))}
                <AddButton onClick={() => setReferences((r) => [...r, blankRef()])} label="Add Another Reference" />
              </div>
            </Card>

            {/* Bottom save */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleSave}
                style={{
                  background: saved ? "#0F6E56" : "#1C1917",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "13px 36px",
                  height: "auto",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background .2s",
                }}
              >
                {saved ? "✓ Profile Saved!" : "Save All Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
