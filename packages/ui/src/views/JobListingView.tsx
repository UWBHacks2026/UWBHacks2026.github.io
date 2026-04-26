import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import { api } from "@repo/ui/lib/api";

// Keep your ALL_LISTINGS and CATEGORIES arrays here as they were...
const CATEGORIES = ["All", "Logistics", "Culinary", "Construction", "Environment", "Social Services", "Transportation", "Community", "Customer Service"];
const ALL_LISTINGS = [
  { id: 1, type: "job", title: "Warehouse Associate", org: "Sunrise Logistics Co.", location: "Chicago, IL", commitment: "Full-time", pay: "$18–21/hr", tags: ["Entry Level", "No Background Check", "Benefits"], category: "Logistics", posted: "2 days ago", color: "#0F6E56", initials: "SL", description: "Join our growing team in a supportive environment. We believe in second chances and offer on-the-job training, health benefits, and a clear path to advancement." },
  { id: 2, type: "volunteer", title: "Community Garden Coordinator", org: "GreenRoots Initiative", location: "Detroit, MI", commitment: "Part-time", pay: "Volunteer", tags: ["Outdoors", "Community", "Flexible Hours"], category: "Environment", posted: "1 day ago", color: "#3B6D11", initials: "GR", description: "Help manage our neighborhood garden program. Build skills in horticulture, community organizing, and leadership." },
  // ... add the rest of your dummy data
];

function OrgAvatar({ initials, color }: { initials: string, color: string }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-[15px] shrink-0"
      style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}30`, color }}
    >
      {initials}
    </div>
  );
}

function ListingCard({ listing, onSelect }: any) {
  const isJob = listing.type === "job";

  return (
    <div
      onClick={() => onSelect(listing)}
      className="bg-brand-card border border-brand-border rounded-2xl p-5 md:p-6 cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#D4CFC8]"
    >
      <div className="flex gap-4 items-start">
        <OrgAvatar initials={listing.initials} color={listing.color} />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2.5 mb-1">
            <div className="min-w-0">
              <h3 className="font-serif text-lg text-text-main m-0 leading-snug truncate">
                {listing.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{listing.org}</p>
            </div>
            <span
              className="rounded-full text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shrink-0"
              style={{
                backgroundColor: isJob ? "#0F6E5612" : "#3B6D1112",
                color: isJob ? "#0F6E56" : "#3B6D11",
                border: `1px solid ${isJob ? "#0F6E5628" : "#3B6D1128"}`
              }}
            >
              {isJob ? "Job" : "Volunteer"}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-sm text-[#57534E] my-2.5">
            <span>📍 {listing.location}</span>
            <span>⏱ {listing.commitment}</span>
            <span className={`font-semibold ${isJob ? "text-brand-green" : "text-text-muted"}`}>
              {listing.pay}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {listing.tags.map((t: string) => (
              <span key={t} className="bg-[#F5F0E8] text-[#57534E] border border-[#EAE5DC] rounded-full text-xs px-2.5 py-0.5">
                {t}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-text-light">Posted {listing.posted}</span>
            <Button className="h-8 text-xs px-4">View Details →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({ listing, onClose }: any) {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-[480px] h-full bg-brand-bg overflow-y-auto p-6 md:p-8 relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-[#EDE8DF] border-none rounded-full w-9 h-9 text-xl text-text-muted cursor-pointer flex items-center justify-center hover:bg-[#E8E3D9] transition-colors"
        >
          ×
        </button>

        <div className="flex gap-3.5 items-center mb-6 pr-10">
          <OrgAvatar initials={listing.initials} color={listing.color} />
          <div>
            <h2 className="font-serif text-[22px] text-text-main m-0 leading-tight">{listing.title}</h2>
            <p className="mt-1 text-sm text-text-muted">{listing.org}</p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-6 grid grid-cols-2 gap-3.5">
          {[["Location", listing.location], ["Schedule", listing.commitment], ["Pay", listing.pay], ["Category", listing.category]].map(([k, v]) => (
            <div key={k}>
              <p className="m-0 text-[11px] text-text-light uppercase tracking-wider font-semibold">{k}</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{v}</p>
            </div>
          ))}
        </div>

        <h4 className="font-serif text-lg mb-2.5 text-text-main">About this opportunity</h4>
        <p className="text-sm text-[#57534E] leading-relaxed mb-6">
          {listing.description}
        </p>

        <div className="mb-7">
          <h4 className="font-serif text-lg mb-3 text-text-main">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((t: string) => (
              <span key={t} className="bg-[#F5F0E8] text-[#57534E] border border-brand-border rounded-full text-sm px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-3.5 mb-7 flex gap-2.5 items-start">
          <span className="text-lg shrink-0">🤝</span>
          <p className="text-sm text-brand-green leading-relaxed m-0">
            <strong>Fair-Chance Employer</strong> — This organization has committed to reviewing all applicants individually, regardless of criminal background.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button className="flex-1 py-3 h-auto text-base">Apply Now</Button>
          <Button variant="outline" className="px-5 py-3 h-auto text-base">♡ Save</Button>
        </div>
      </div>
    </div>
  );
}

export function JobListingPage({ searchQuery = "", user }: { searchQuery?: string, user?: any }) {
  const [tab, setTab] = useState("all");
  const [category, setCategory] = useState("All");
  const [commitment, setCommitment] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [internalSearch, setInternalSearch] = useState(searchQuery);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setInternalSearch(searchQuery); }, [searchQuery]);

  useEffect(() => {
    async function loadJobs() {
      // Prevent if user does not exist yet
      if (!user?.candidateId) return;

      setLoading(true);
      try {
        const data = await api.searchMatchedJobs(user.candidateId, user.county || "King County");

        const formattedJobs = data.matches.map((m: any) => ({
          ...m.job,
          type: "job",
          commitment: m.job.employmentType === "full-time" ? "Full-time" : "Part-time",
          tags: m.matchedSkills,
          score: m.score
        }));

        setJobs(formattedJobs);
      } catch (err) {
        setError("Failed to load opportunities. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [user]);

  const filtered = jobs.filter((l) => {
    if (tab !== "all" && l.type !== tab) return false;
    const q = internalSearch.toLowerCase();
    if (q && !l.title.toLowerCase().includes(q) && !l.org.toLowerCase().includes(q)) return false;
    return true;
  });

  // Interface
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-9 pb-20">

      {/* Header */}
      <div className="mb-7">
        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-2">Opportunities</h1>
        <p className="text-sm md:text-base text-text-muted">
          Based on your skills, we found {jobs.length} matched positions in {user?.county || "Washington"}.
        </p>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="text-center py-16 text-text-muted">Loading your matched opportunities...</div>
      ) : error ? (
        <div className="text-center py-16 text-brand-orange">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="font-serif text-2xl text-text-main mb-2.5">No matches found</p>
          <p className="text-sm text-text-muted">Try updating your profile skills to see more jobs.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
          ))}
        </div>
      )}

      <DetailDrawer listing={selected} onClose={() => setSelected(null)} />
    </div>
  );
}