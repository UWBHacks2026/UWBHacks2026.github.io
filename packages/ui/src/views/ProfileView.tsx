"use client";

import { useState, useEffect, Key } from "react";
import { Button } from "@repo/ui/components/button";
import { api } from "@repo/ui/lib/api";

// ─── Reusable UI Components ─────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
    {children}
  </label>
);

const TextField = ({ label, value, onChange, placeholder, type = "text", multiline = false, rows = 3 }: any) => (
  <div className="mb-5">
    <Label>{label}</Label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-brand-card border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-text-main resize-y outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/60 placeholder:text-text-light transition-colors leading-relaxed"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-brand-card border border-brand-border rounded-lg px-3.5 text-sm text-text-main outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/60 placeholder:text-text-light transition-colors"
      />
    )}
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="flex justify-between items-end mb-6 pb-3.5 border-b border-brand-border">
    <div>
      <h2 className="font-serif text-[22px] text-text-main m-0">{title}</h2>
      {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
    </div>
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 mb-6">
    {children}
  </div>
);

const AddButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className="w-full mt-1 flex items-center justify-center gap-1.5 bg-brand-green/5 text-brand-green border-2 border-dashed border-brand-green/20 rounded-xl py-3 text-sm font-semibold hover:bg-brand-green/10 transition-colors"
  >
    + {label}
  </button>
);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-brand-orange/10 text-brand-orange rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-brand-orange/20 transition-colors"
  >
    Remove
  </button>
);

// ─── Data Factories ─────────────────────────────────────────────────────────

const blankJob = () => ({ id: Date.now(), title: "", employer: "", start: "", end: "", current: false, description: "" });
const blankEdu = () => ({ id: Date.now(), school: "", degree: "", field: "", year: "" });
const blankRef = () => ({ id: Date.now(), name: "", relationship: "", phone: "", email: "" });

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProfilePage({ user, onProfileUpdated }: any) {
  // Try to load initial state from user object, fallback to empty
  const [personal, setPersonal] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    city: user?.city || "", 
    state: user?.state || "", 
    bio: user?.bio || "", 
    linkedin: user?.linkedin || "" 
  });
  
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  
  const [jobs, setJobs] = useState(user?.jobs?.length ? user.jobs : [blankJob()]);
  const [education, setEducation] = useState(user?.education?.length ? user.education : [blankEdu()]);
  const [references, setReferences] = useState(user?.references?.length ? user.references : [blankRef()]);
  
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  // State updaters
  const setP = (field: string) => (val: string) => setPersonal((p) => ({ ...p, [field]: val }));
  const updateItem = (list: any[], setList: any, id: number, field: string, val: any) =>
    setList(list.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  const removeItem = (list: any[], setList: any, id: number) =>
    setList(list.filter((item) => item.id !== id));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((arr) => [...arr, s]);
    setSkillInput("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Format names for backend
      const [firstName, ...lastNames] = personal.name.split(" ");
      const lastName = lastNames.join(" ");

      // Save supported fields to backend

      const payload = await api.createCandidate({
        email: personal.email,
        passwordHash: "dummy-hash-for-now", 
        firstName: firstName || "",
        lastName: lastName || "",
        phone: personal.phone,
        county: personal.city ? `${personal.city} County` : "King County", // Simple fallback mapping
        state: personal.state || "WA",
        bio: personal.bio,
        skills: skills.join(", "), // Backend runs this through regex
        languages: "English", 
      });

      let response;

      if (user?.candidateId) {
        response = await api.updateCandidate(user.candidateId, payload);
      } else {
        response = await api.createCandidate(payload);
      }

      // Package state for local persistence
      const fullProfile = {
        ...user,
        ...personal,
        skills,
        jobs,
        education,
        references,
        candidateId: response.candidate?.id || user?.candidateId
      };

      // Update Context / App State
      if (onProfileUpdated) {
        onProfileUpdated(fullProfile);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Failed to save profile. Make sure the backend is running.");
    } finally {
      setIsSaving(false);
    }
  };

  // Profile strength logic
  const completionScore = () => {
    let score = 0;
    if (personal.name) score += 20;
    if (personal.bio) score += 15;
    if (personal.phone) score += 10;
    if (skills.length > 0) score += 20;
    if (jobs.some((j: { title: any; }) => j.title)) score += 20;
    if (education.some((e: { school: any; }) => e.school)) score += 15;
    return Math.min(score, 100);
  };
  const pct = completionScore();

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-9 pb-20">
      
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-2">My Profile</h1>
          <p className="text-sm md:text-base text-text-muted">Build your resume. Employers see this when you apply.</p>
        </div>
        <div className="hidden md:block">
           <Button onClick={handleSave} disabled={isSaving} className={`px-8 py-3 shadow-sm transition-colors ${saved ? "bg-brand-green" : "bg-text-main"}`}>
            {isSaving ? "Saving..." : saved ? "✓ Saved!" : "Save Profile"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-7 items-start">
        
        {/* ─── Sidebar ─── */}
        <div className="sticky top-20 hidden md:block z-10">
          <div className="bg-brand-dark rounded-2xl p-5 mb-4">
            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-1.5">Profile Strength</p>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="font-serif text-3xl text-brand-bg">{pct}%</span>
              <span className="text-xs text-text-muted">complete</span>
            </div>
            <div className="bg-[#3D3530] rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? "bg-brand-green" : pct >= 50 ? "bg-brand-gold" : "bg-brand-orange"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <nav className="bg-brand-card border border-brand-border rounded-xl p-1.5 space-y-0.5 shadow-sm">
            {[
              { id: "personal", label: "Personal Info" },
              { id: "experience", label: "Work Experience" },
              { id: "education", label: "Education" },
              { id: "skills", label: "Skills" },
              { id: "references", label: "References" },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === sec.id 
                    ? "bg-brand-green/10 text-brand-green" 
                    : "text-[#57534E] hover:bg-[#F5F0E8] hover:text-text-main"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ─── Main Content Form ─── */}
        <div className="space-y-6">
          
          {/* PERSONAL INFO */}
          <Card>
            <div id="personal">
              <SectionHeader title="Personal Information" subtitle="Your basic contact details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                <TextField label="Full Name" value={personal.name} onChange={setP("name")} placeholder="Your full name" />
                <TextField label="Email" value={personal.email} onChange={setP("email")} placeholder="you@email.com" type="email" />
                <TextField label="Phone Number" value={personal.phone} onChange={setP("phone")} placeholder="(555) 000-0000" type="tel" />
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="City" value={personal.city} onChange={setP("city")} placeholder="Chicago" />
                  <TextField label="State" value={personal.state} onChange={setP("state")} placeholder="IL" />
                </div>
              </div>
              <TextField label="LinkedIn / Website" value={personal.linkedin} onChange={setP("linkedin")} placeholder="linkedin.com/in/yourname" />
              <TextField label="About Me" value={personal.bio} onChange={setP("bio")} placeholder="Write 2–3 sentences about yourself, your goals, and what kind of work you're looking for..." multiline rows={4} />
            </div>
          </Card>

          {/* WORK EXPERIENCE */}
          <Card>
            <div id="experience">
              <SectionHeader title="Work Experience" subtitle="Include any paid or unpaid work, including prison jobs" />
              {jobs.map((job: { id: number; title: any; employer: any; start: any; current: boolean | undefined; end: any; description: any; }, idx: number) => (
                <div key={job.id} className={`mb-6 pb-6 ${idx < jobs.length - 1 ? "border-b border-[#F0EBE1]" : ""}`}>
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-xs font-bold text-text-light uppercase tracking-wider m-0">Position {idx + 1}</p>
                    {jobs.length > 1 && <RemoveButton onClick={() => removeItem(jobs, setJobs, job.id)} />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <TextField label="Job Title" value={job.title} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "title", v)} placeholder="e.g. Warehouse Associate" />
                    <TextField label="Employer / Organization" value={job.employer} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "employer", v)} placeholder="Company name" />
                    <TextField label="Start Date" value={job.start} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "start", v)} placeholder="MM/YYYY" />
                    <TextField label={job.current ? "End Date (Current)" : "End Date"} value={job.current ? "Present" : job.end} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "end", v)} placeholder="MM/YYYY or Present" />
                  </div>
                  <div className="flex items-center gap-2 mb-5 -mt-2">
                    <input
                      type="checkbox"
                      id={`current-${job.id}`}
                      checked={job.current}
                      onChange={(e) => updateItem(jobs, setJobs, job.id, "current", e.target.checked)}
                      className="w-4 h-4 accent-brand-green cursor-pointer rounded border-brand-border"
                    />
                    <label htmlFor={`current-${job.id}`} className="text-sm font-medium text-[#57534E] cursor-pointer">I currently work here</label>
                  </div>
                  <TextField label="Description" value={job.description} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "description", v)} placeholder="Briefly describe your responsibilities and accomplishments..." multiline rows={3} />
                </div>
              ))}
              <AddButton onClick={() => setJobs((j: any) => [...j, blankJob()])} label="Add Another Position" />
            </div>
          </Card>

          {/* EDUCATION */}
          <Card>
            <div id="education">
              <SectionHeader title="Education" subtitle="Include GEDs, trade programs, certificates, and college" />
              {education.map((edu: { id: number; school: any; degree: any; field: any; year: any; }, idx: number) => (
                <div key={edu.id} className={`mb-6 pb-6 ${idx < education.length - 1 ? "border-b border-[#F0EBE1]" : ""}`}>
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-xs font-bold text-text-light uppercase tracking-wider m-0">Entry {idx + 1}</p>
                    {education.length > 1 && <RemoveButton onClick={() => removeItem(education, setEducation, edu.id)} />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <TextField label="School / Institution" value={edu.school} onChange={(v: string) => updateItem(education, setEducation, edu.id, "school", v)} placeholder="School or program name" />
                    <TextField label="Degree / Certificate" value={edu.degree} onChange={(v: string) => updateItem(education, setEducation, edu.id, "degree", v)} placeholder="e.g. GED, Associate's, Diploma" />
                    <TextField label="Field of Study" value={edu.field} onChange={(v: string) => updateItem(education, setEducation, edu.id, "field", v)} placeholder="e.g. Business, Welding, General" />
                    <TextField label="Year Completed" value={edu.year} onChange={(v: string) => updateItem(education, setEducation, edu.id, "year", v)} placeholder="YYYY or In Progress" />
                  </div>
                </div>
              ))}
              <AddButton onClick={() => setEducation((e: any) => [...e, blankEdu()])} label="Add Another Entry" />
            </div>
          </Card>

          {/* SKILLS */}
          <Card>
            <div id="skills">
              <SectionHeader title="Skills" subtitle="Add skills you have — technical, soft, or trade-specific" />
              <div className="flex gap-2.5 mb-6">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Type a skill and press Enter..."
                  className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 text-sm text-text-main outline-none focus:border-brand-green/60 h-11"
                />
                <Button onClick={addSkill} className="px-6 h-11 text-sm">Add</Button>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Common skills — click to add:</p>
                <div className="flex flex-wrap gap-2">
                  {["Forklift", "Customer Service", "Microsoft Office", "Team Leadership", "Inventory Management", "CDL License", "Welding", "Carpentry", "Cooking", "Data Entry", "Python", "Management"].filter((s) => !skills.includes(s)).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSkills((arr) => [...arr, s])}
                      className="bg-brand-bg text-[#78716C] border border-brand-border rounded-full text-xs px-3 py-1.5 cursor-pointer hover:border-[#D4CFC8] hover:text-text-main transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Your Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full text-sm px-3 py-1.5 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => setSkills((arr) => arr.filter((s) => s !== skill))}
                          className="text-brand-green hover:text-[#0c5945] focus:outline-none"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* REFERENCES */}
          <Card>
            <div id="references">
              <SectionHeader title="References" subtitle="People who can vouch for your character or work" />
              {references.map((ref: { id: number; name: any; relationship: any; phone: any; email: any; }, idx: number) => (
                <div key={ref.id} className={`mb-6 pb-6 ${idx < references.length - 1 ? "border-b border-[#F0EBE1]" : ""}`}>
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-xs font-bold text-text-light uppercase tracking-wider m-0">Reference {idx + 1}</p>
                    {references.length > 1 && <RemoveButton onClick={() => removeItem(references, setReferences, ref.id)} />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <TextField label="Full Name" value={ref.name} onChange={(v: string) => updateItem(references, setReferences, ref.id, "name", v)} placeholder="Reference's name" />
                    <TextField label="Relationship" value={ref.relationship} onChange={(v: string) => updateItem(references, setReferences, ref.id, "relationship", v)} placeholder="e.g. Former Supervisor, Mentor" />
                    <TextField label="Phone Number" value={ref.phone} onChange={(v: string) => updateItem(references, setReferences, ref.id, "phone", v)} placeholder="(555) 000-0000" type="tel" />
                    <TextField label="Email Address" value={ref.email} onChange={(v: string) => updateItem(references, setReferences, ref.id, "email", v)} placeholder="their@email.com" type="email" />
                  </div>
                </div>
              ))}
              <AddButton onClick={() => setReferences((r: any) => [...r, blankRef()])} label="Add Another Reference" />
            </div>
          </Card>

          {/* Mobile Save Button */}
          <div className="md:hidden pb-8">
            <Button onClick={handleSave} disabled={isSaving} className={`w-full py-4 text-base shadow-sm ${saved ? "bg-brand-green" : "bg-text-main"}`}>
              {isSaving ? "Saving..." : saved ? "✓ Profile Saved!" : "Save All Changes"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}