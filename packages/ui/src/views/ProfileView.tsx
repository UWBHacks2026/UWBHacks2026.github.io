import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { api } from "@repo/ui/lib/api";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-[#57534E] mb-1.5 uppercase tracking-wider">
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

const SectionHeader = ({ title, subtitle, action }: any) => (
  <div className="flex justify-between items-end mb-6 pb-3.5 border-b border-brand-border">
    <div>
      <h2 className="font-serif text-[22px] text-text-main m-0">{title}</h2>
      {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 mb-6 ${className}`}>
    {children}
  </div>
);

const AddButton = ({ onClick, label }: any) => (
  <button
    onClick={onClick}
    className="w-full mt-1 flex items-center justify-center gap-1.5 bg-brand-green/10 text-brand-green border-2 border-dashed border-brand-green/30 rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-green/20 transition-colors"
  >
    + {label}
  </button>
);

const RemoveButton = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-brand-orange/10 text-brand-orange rounded-lg px-2.5 py-1 text-xs hover:bg-brand-orange/20 transition-colors"
  >
    Remove
  </button>
);

// Blank data factories
const blankJob = () => ({ id: Date.now(), title: "", employer: "", start: "", end: "", current: false, description: "" });
const blankEdu = () => ({ id: Date.now(), school: "", degree: "", field: "", year: "" });
const blankRef = () => ({ id: Date.now(), name: "", relationship: "", phone: "", email: "" });

export function ProfilePage({ user }: any) {
  const [personal, setPersonal] = useState({ name: user?.name || "", email: user?.email || "", phone: "", city: "", state: "", bio: "", linkedin: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [jobs, setJobs] = useState([blankJob()]);
  const [education, setEducation] = useState([blankEdu()]);
  const [references, setReferences] = useState([blankRef()]);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);

  const setP = (field: string) => (val: string) => setPersonal((p) => ({ ...p, [field]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((arr) => [...arr, s]);
    setSkillInput("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Split "Full Name" into First and Last for the backend
      const [firstName, ...lastNames] = personal.name.split(" ");
      const lastName = lastNames.join(" ");

      // Send to Hono backend POST /candidates
      const response = await api.createCandidate({
        email: personal.email,
        passwordHash: "dummy-hash-for-now", // In a real app, this is handled via auth/session
        firstName: firstName || "",
        lastName: lastName || "",
        phone: personal.phone,
        county: "King County", // Hardcoded for this example, you should add a county dropdown to the UI
        state: personal.state,
        bio: personal.bio,
        skills: skills.join(", "), // Backend runs this through extractSkills regex
        languages: "English", // Add language state if needed
      });

      // Optionally pass the updated candidate ID back up to the App state
      // if (onProfileUpdated && response.candidate) {
      //   onProfileUpdated({ ...user, candidateId: response.candidate.id });
      // }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateItem = (list: any[], setList: any, id: number, field: string, val: any) =>
    setList(list.map((item) => (item.id === id ? { ...item, [field]: val } : item)));

  const removeItem = (list: any[], setList: any, id: number) =>
    setList(list.filter((item) => item.id !== id));

  // Profile strength logic
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
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-9 pb-20">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-2">My Profile</h1>
        <p className="text-sm md:text-base text-text-muted">Build your resume. Employers see this when you apply.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-7 items-start">
        
        {/* Sidebar */}
        <div className="sticky top-20 hidden md:block">
          <div className="bg-brand-dark rounded-2xl p-5 mb-4">
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1.5">Profile Strength</p>
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

          <nav className="bg-brand-card border border-brand-border rounded-xl p-1.5 space-y-0.5">
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
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === sec.id 
                    ? "bg-brand-green/10 text-brand-green font-semibold" 
                    : "text-[#57534E] hover:bg-[#F5F0E8]"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </nav>

          <Button 
            onClick={handleSave} 
            className={`w-full mt-4 py-3 text-sm transition-colors ${saved ? "bg-brand-green" : "bg-text-main"}`}
          >
            {saved ? "✓ Saved!" : "Save Profile"}
          </Button>
        </div>

        {/* Main Content Form */}
        <div className="space-y-6">
          
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
              <TextField label="About Me" value={personal.bio} onChange={setP("bio")} placeholder="Write 2–3 sentences about yourself..." multiline rows={4} />
            </div>
          </Card>

          <Card>
            <div id="experience">
              <SectionHeader title="Work Experience" subtitle="Include any paid or unpaid work, including prison jobs" />
              {jobs.map((job, idx) => (
                <div key={job.id} className={`mb-6 pb-6 ${idx < jobs.length - 1 ? "border-b border-[#F0EBE1]" : ""}`}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-text-light uppercase tracking-wider m-0">Position {idx + 1}</p>
                    {jobs.length > 1 && <RemoveButton onClick={() => removeItem(jobs, setJobs, job.id)} />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <TextField label="Job Title" value={job.title} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "title", v)} placeholder="e.g. Warehouse Associate" />
                    <TextField label="Employer / Organization" value={job.employer} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "employer", v)} placeholder="Company name" />
                    <TextField label="Start Date" value={job.start} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "start", v)} placeholder="MM/YYYY" />
                    <TextField label={job.current ? "End Date (Current)" : "End Date"} value={job.current ? "Present" : job.end} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "end", v)} placeholder="MM/YYYY or Present" />
                  </div>
                  <div className="flex items-center gap-2 mb-4 -mt-1">
                    <input
                      type="checkbox"
                      id={`current-${job.id}`}
                      checked={job.current}
                      onChange={(e) => updateItem(jobs, setJobs, job.id, "current", e.target.checked)}
                      className="w-4 h-4 accent-brand-green cursor-pointer rounded"
                    />
                    <label htmlFor={`current-${job.id}`} className="text-sm text-[#57534E] cursor-pointer">I currently work here</label>
                  </div>
                  <TextField label="Description" value={job.description} onChange={(v: string) => updateItem(jobs, setJobs, job.id, "description", v)} placeholder="Briefly describe your responsibilities..." multiline rows={3} />
                </div>
              ))}
              <AddButton onClick={() => setJobs((j) => [...j, blankJob()])} label="Add Another Position" />
            </div>
          </Card>

          {/* Additional cards (Education, Skills, References) follow the exact same structural pattern using the components above */}
          
          <div className="flex justify-end md:hidden">
            <Button onClick={handleSave} className={`w-full py-3 text-base ${saved ? "bg-brand-green" : "bg-text-main"}`}>
              {saved ? "✓ Profile Saved!" : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}