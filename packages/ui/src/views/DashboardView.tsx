import { Button } from "@repo/ui/components/button";

export const STATS = [
  { num: "240+", label: "Open Positions" },
  { num: "80+", label: "Volunteer Roles" },
  { num: "150+", label: "Partner Employers" },
  { num: "1,200+", label: "People Placed" },
];

export const HOW_IT_WORKS = [
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

export const FEATURED = [
  {
    id: 1, // Added IDs to make React mapping easier
    title: "Warehouse Associate",
    org: "Sunrise Logistics Co.",
    location: "Chicago, IL",
    pay: "$18-21/hr",
    type: "job",
    color: "#0F6E56",
    initials: "SL",
    tags: ["Entry Level", "Benefits"],
  },
  {
    id: 2,
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
    id: 3,
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

export const VALUES = [
  { 
    icon: "🤝", 
    title: "Dignity First", 
    desc: "We believe every person deserves to be seen for their potential, not reduced to their past." 
  },
  { 
    icon: "🔓", 
    title: "Radical Transparency", 
    desc: "Employers on our platform have signed a fair-chance pledge. No surprises at the final stage." 
  },
  { 
    icon: "🌱", 
    title: "Long-term Support", 
    desc: "We don't just match you to a job. We provide resources for lasting stability and growth." 
  },
];

export function DashboardPage({ LinkComponent = "a" }: any) {
  return (
    <div className="bg-brand-bg min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-brand-dark px-6 py-20 md:py-32 text-center relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-brand-green/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-brand-green/5 pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <span className="inline-block bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Fair-chance employment & volunteering
          </span>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-bg leading-tight tracking-tight mb-6">
            Your next chapter <em className="text-brand-green not-italic">starts now</em>
          </h1>

          <p className="text-base md:text-lg text-text-light leading-relaxed max-w-xl mx-auto mb-10">
            Second Chapter connects people with criminal records to employers who 
            believe in second chances — and communities that need their talents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkComponent href="/jobs">
              <Button className="w-full sm:w-auto px-8 py-3.5 text-base rounded-xl">
                Browse Opportunities →
              </Button>
            </LinkComponent>
            <LinkComponent href="/login">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-3.5 text-base rounded-xl text-brand-bg border-[#3D3530] hover:bg-[#2A2118]">
                Create Free Profile
              </Button>
            </LinkComponent>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#221A14] py-8 px-6 border-b border-[#2A2118]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl md:text-4xl text-brand-bg mb-2">{s.num}</p>
              <p className="text-sm text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-3">Simple & transparent</p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main">How Second Chapter works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="bg-brand-card border border-brand-border rounded-2xl p-8 relative overflow-hidden">
              <span className="font-serif text-6xl absolute top-4 right-4 leading-none select-none" style={{ color: `${step.color}15` }}>
                {step.step}
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${step.color}18`, border: `1.5px solid ${step.color}30`, color: step.color }}>
                <span className="font-serif font-bold text-sm">{step.step}</span>
              </div>
              <h3 className="font-serif text-xl text-text-main mb-3">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings (Abbreviated for length, translates similar to above) */}
      {/* ... */}
      
    </div>
  );
}