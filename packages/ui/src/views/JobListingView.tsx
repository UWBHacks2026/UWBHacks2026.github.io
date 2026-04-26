import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import { api } from "@repo/ui/lib/api";

// Standard categories from your initial design
const CATEGORIES = ["All", "Logistics", "Culinary", "Construction", "Environment", "Social Services", "Transportation", "Community", "Customer Service", "General"];

// Comprehensive list of Washington Counties
const WA_COUNTIES = [
  "Adams County", "Asotin County", "Benton County", "Chelan County", "Clallam County", 
  "Clark County", "Columbia County", "Cowlitz County", "Douglas County", "Ferry County", 
  "Franklin County", "Garfield County", "Grant County", "Grays Harbor County", "Island County", 
  "Jefferson County", "King County", "Kitsap County", "Kittitas County", "Klickitat County", 
  "Lewis County", "Lincoln County", "Mason County", "Okanogan County", "Pacific County", 
  "Pend Oreille County", "Pierce County", "San Juan County", "Skagit County", "Skamania County", 
  "Snohomish County", "Spokane County", "Stevens County", "Thurston County", "Wahkiakum County", 
  "Walla Walla County", "Whatcom County", "Whitman County", "Yakima County"
];

// --- Subcomponents (OrgAvatar, ListingCard, DetailDrawer) remain exactly the same as before ---
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
            {/* Show Match Score if available from backend */}
            {listing.score !== undefined && (
               <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shrink-0">
                 {listing.score}% Match
               </span>
            )}
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

// Keep your DetailDrawer implementation here...
function DetailDrawer({ listing, onClose }: any) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex justify-end" onClick={onClose}>
      <div className="w-full max-w-[480px] h-full bg-brand-bg overflow-y-auto p-6 md:p-8 relative animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 bg-[#EDE8DF] border-none rounded-full w-9 h-9 text-xl text-text-muted cursor-pointer flex items-center justify-center hover:bg-[#E8E3D9] transition-colors">×</button>
        <div className="flex gap-3.5 items-center mb-6 pr-10">
          <OrgAvatar initials={listing.initials} color={listing.color} />
          <div>
            <h2 className="font-serif text-[22px] text-text-main m-0 leading-tight">{listing.title}</h2>
            <p className="mt-1 text-sm text-text-muted">{listing.org}</p>
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-6 grid grid-cols-2 gap-3.5">
          {[["Location", listing.location], ["Schedule", listing.commitment], ["Pay", listing.pay], ["Category", listing.category]].map(([k, v]) => (
            <div key={k}>
              <p className="m-0 text-[11px] text-text-light uppercase tracking-wider font-semibold">{k}</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{v}</p>
            </div>
          ))}
        </div>
        <h4 className="font-serif text-lg mb-2.5 text-text-main">About this opportunity</h4>
        <p className="text-sm text-[#57534E] leading-relaxed mb-6">{listing.description}</p>
        <div className="mb-7">
          <h4 className="font-serif text-lg mb-3 text-text-main">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((t: string) => (
              <span key={t} className="bg-[#F5F0E8] text-[#57534E] border border-brand-border rounded-full text-sm px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-3.5 mb-7 flex gap-2.5 items-start">
          <span className="text-lg shrink-0">🤝</span>
          <p className="text-sm text-brand-green leading-relaxed m-0"><strong>Fair-Chance Employer</strong> — This organization has committed to reviewing all applicants individually, regardless of criminal background.</p>
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
  // --- Local State ---
  const [selectedCounty, setSelectedCounty] = useState(user?.county || "King County");
  const [category, setCategory] = useState("All");
  const [commitment, setCommitment] = useState("all");
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [selected, setSelected] = useState<any>(null);
  
  // --- API State ---
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync navbar search down to local state
  useEffect(() => { setInternalSearch(searchQuery); }, [searchQuery]);

  // --- Auto-fetch Jobs ---
  // Re-runs whenever the user selects a new county
  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        // Fetch from backend using the dropdown's selected county
        const data: any = await api.searchMatchedJobs(user?.candidateId, selectedCounty);
        
        // Map backend schema to UI schema
        const formattedJobs = data.matches.map((m: any) => ({
          ...m.job,
          type: "job", 
          commitment: m.job.employmentType === "full-time" ? "Full-time" : m.job.employmentType === "part-time" ? "Part-time" : "Flexible",
          tags: m.matchedSkills.length ? m.matchedSkills : m.job.skills?.slice(0, 3) || ["Entry Level"],
          score: m.score, // Propagating the match score for the UI
        }));
        
        setJobs(formattedJobs);
      } catch (err) {
        console.error(err);
        setError(`Failed to load jobs for ${selectedCounty}. Please try again.`);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [user, selectedCounty]);

  // --- Frontend Filtering ---
  // Filters the API results by category, commitment, and search bar terms
  const filtered = jobs.filter((l) => {
    if (category !== "All" && l.category !== category) return false;
    if (commitment === "fulltime" && l.commitment !== "Full-time") return false;
    if (commitment === "parttime" && l.commitment === "Full-time") return false;
    
    const q = internalSearch.toLowerCase();
    if (q && !l.title.toLowerCase().includes(q) && !l.org.toLowerCase().includes(q) && !l.tags.some((t: string) => t.toLowerCase().includes(q))) return false;
    
    return true;
  });

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-9 pb-20">
      
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-2">Opportunities</h1>
        <p className="text-sm md:text-base text-text-muted">
          Based on your skills, here are your matched positions in Washington State.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-brand-card p-4 rounded-2xl border border-brand-border">
        
        {/* COUNTY DROPDOWN (API Trigger) */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Location</label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-xl text-sm text-text-main h-11 px-3 outline-none focus:border-brand-green/60 cursor-pointer"
          >
            {WA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* CATEGORY DROPDOWN (Frontend Filter) */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Job Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-xl text-sm text-text-main h-11 px-3 outline-none focus:border-brand-green/60 cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* COMMITMENT DROPDOWN (Frontend Filter) */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Schedule</label>
          <select
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-xl text-sm text-text-main h-11 px-3 outline-none focus:border-brand-green/60 cursor-pointer"
          >
            <option value="all">All Schedules</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time / Flexible</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(category !== "All" || commitment !== "all" || internalSearch || selectedCounty !== (user?.county || "King County")) && (
          <div className="flex flex-col gap-1.5 self-end pb-0.5">
            <button
              onClick={() => { setCategory("All"); setCommitment("all"); setInternalSearch(""); setSelectedCounty(user?.county || "King County"); }}
              className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-xl text-xs px-4 h-11 font-semibold hover:bg-brand-orange/20 transition-colors whitespace-nowrap"
            >
              Clear ×
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="font-serif text-xl text-text-main">
          {loading ? "Searching..." : `Showing ${filtered.length} matches`}
        </h2>
      </div>

      {/* Listings / States */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-muted font-medium tracking-wide">Fetching jobs from USAJobs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
          <p className="text-brand-orange font-medium">{error}</p>
          {!user?.candidateId && (
            <Button className="mt-4" onClick={() => window.location.href = '/profile'}>
              Go to Profile
            </Button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-brand-card border border-brand-border rounded-2xl">
          <p className="font-serif text-2xl text-text-main mb-2.5">No matches found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters or searching a different county.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
          ))}
        </div>
      )}

      {/* Footer attribution */}
      <div className="mt-10 py-5 text-center">
        <p className="text-sm text-text-muted max-w-[600px] mx-auto">
          This site incorporates information from <a href="https://services.onetcenter.org/" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">O*NET Web Services</a> by the U.S. Department of Labor.
        </p>
      </div>

      <DetailDrawer listing={selected} onClose={() => setSelected(null)} />
    </div>
  );
}