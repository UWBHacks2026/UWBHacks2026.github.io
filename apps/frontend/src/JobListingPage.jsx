/**
 * @typedef {Object} JobListing
 * @property {number} id - Unique identifier for the listing
 * @property {string} type - "job" or "volunteer"
 * @property {string} title - Job title
 * @property {string} org - Organization name
 * @property {string} location - Job location (city, state)
 * @property {string} commitment - Work schedule (Full-time, Part-time, Flexible)
 * @property {string} pay - Pay rate or "Volunteer"
 * @property {string[]} tags - Array of tag strings
 * @property {string} category - Job category
 * @property {string} posted - How long ago posted (e.g., "2 days ago")
 * @property {string} color - Brand color hex code
 * @property {string} initials - Organization initials (2-3 chars)
 * @property {string} description - Full job description
 */

/**
 * @typedef {Object} ListingProps
 * @property {JobListing} listing - The job/volunteer listing data
 * @property {function} onSelect - Callback when listing is clicked
 */

/**
 * @typedef {Object} DrawerProps
 * @property {JobListing|null} listing - The selected listing to display
 * @property {function} onClose - Callback to close the drawer
 */

/**
 * @typedef {Object} PageProps
 * @property {string} [searchQuery] - External search query from navbar
 */

/**
 * @typedef {Object} FilterState
 * @property {string} tab - Current tab filter: "all", "job", or "volunteer"
 * @property {string} category - Current category filter: "All" or category name
 * @property {string} commitment - Current commitment filter: "all", "fulltime", or "parttime"
 * @property {Object} selected - Currently selected listing for detail drawer
 * @property {string} internalSearch - Internal search query state
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";


/** @type {JobListing[]} */
const ALL_LISTINGS = [
  { id: 1, type: "job", title: "Warehouse Associate", org: "Sunrise Logistics Co.", location: "Chicago, IL", commitment: "Full-time", pay: "$18–21/hr", tags: ["Entry Level", "No Background Check", "Benefits"], category: "Logistics", posted: "2 days ago", color: "#0F6E56", initials: "SL", description: "Join our growing team in a supportive environment. We believe in second chances and offer on-the-job training, health benefits, and a clear path to advancement. No prior warehouse experience required — we train from day one." },
  { id: 2, type: "volunteer", title: "Community Garden Coordinator", org: "GreenRoots Initiative", location: "Detroit, MI", commitment: "Part-time", pay: "Volunteer", tags: ["Outdoors", "Community", "Flexible Hours"], category: "Environment", posted: "1 day ago", color: "#3B6D11", initials: "GR", description: "Help manage our neighborhood garden program. Build skills in horticulture, community organizing, and leadership. Great for résumé building and professional references." },
  { id: 3, type: "job", title: "Kitchen Staff & Prep Cook", org: "Harvest Table Restaurant", location: "Atlanta, GA", commitment: "Full-time", pay: "$16–19/hr", tags: ["Food Service", "Training Provided", "Fair Chance"], category: "Culinary", posted: "3 days ago", color: "#BA7517", initials: "HT", description: "We are a proud fair-chance employer. Our kitchen team is tight-knit and supportive. No experience needed — we train everyone from scratch. Meal included every shift." },
  { id: 4, type: "job", title: "Forklift Operator", org: "Apex Distribution Center", location: "Houston, TX", commitment: "Full-time", pay: "$20–24/hr", tags: ["Certified Operators", "Overtime Available", "Benefits"], category: "Logistics", posted: "5 days ago", color: "#185FA5", initials: "AD", description: "Licensed forklift operators needed for our busy distribution facility. We offer competitive pay, generous overtime, and full benefits. Criminal backgrounds reviewed individually." },
  { id: 5, type: "volunteer", title: "Peer Mentor — Youth Outreach", org: "Pathways Forward", location: "Los Angeles, CA", commitment: "Part-time", pay: "Volunteer + Stipend", tags: ["Mentorship", "Youth", "Stipend Available"], category: "Social Services", posted: "Today", color: "#993556", initials: "PF", description: "Use your lived experience to positively guide at-risk youth. We provide full training, a monthly stipend, and a certificate of completion recognized by many employers." },
  { id: 6, type: "job", title: "Construction Laborer", org: "BuildRight Contractors", location: "Phoenix, AZ", commitment: "Full-time", pay: "$22–26/hr", tags: ["Physical Work", "OSHA Training", "Union Eligible"], category: "Construction", posted: "1 week ago", color: "#534AB7", initials: "BR", description: "Join our growing construction crew. We offer OSHA-10 certification on your first week, union eligibility after 90 days, and real advancement opportunities." },
  { id: 7, type: "volunteer", title: "Food Bank Volunteer", org: "Second Harvest Coalition", location: "Denver, CO", commitment: "Flexible", pay: "Volunteer", tags: ["Weekends OK", "Family Friendly", "No Experience Needed"], category: "Community", posted: "4 days ago", color: "#0F6E56", initials: "SH", description: "Sort, pack, and distribute food to families in need. Ideal for building a strong volunteer record and professional references. All ages and backgrounds welcome." },
  { id: 8, type: "job", title: "Delivery Driver — Local Routes", org: "Metro Courier Services", location: "Philadelphia, PA", commitment: "Part-time", pay: "$17/hr + tips", tags: ["Driver's License Required", "Flexible", "Immediate Hire"], category: "Transportation", posted: "2 days ago", color: "#D85A30", initials: "MC", description: "Local delivery routes with flexible scheduling. Valid driver's license required. We review each applicant individually and do not auto-reject based on record type." },
  { id: 9, type: "job", title: "Landscaping Crew Member", org: "Green Horizon Landscaping", location: "Nashville, TN", commitment: "Full-time", pay: "$16–20/hr", tags: ["Outdoors", "Physical Work", "Training Provided"], category: "Environment", posted: "3 days ago", color: "#3B6D11", initials: "GH", description: "Work outdoors maintaining commercial and residential properties. Equipment training provided. Fair-chance employer with a track record of promoting from within." },
  { id: 10, type: "job", title: "Customer Service Rep", org: "FreshStart Call Center", location: "Remote", commitment: "Full-time", pay: "$15–17/hr", tags: ["Remote", "Training Provided", "Fair Chance"], category: "Customer Service", posted: "Today", color: "#185FA5", initials: "FC", description: "Handle inbound customer inquiries from home. All equipment provided. 2-week paid training included. We have a company-wide fair-chance policy and celebrate diverse backgrounds." },
  { id: 11, type: "volunteer", title: "Animal Shelter Volunteer", org: "Compassion Animal Rescue", location: "Seattle, WA", commitment: "Flexible", pay: "Volunteer", tags: ["Animals", "Compassionate Work", "References Provided"], category: "Community", posted: "6 days ago", color: "#993556", initials: "CA", description: "Help care for shelter animals including dogs, cats, and small pets. Volunteers consistently report this role as one of the most meaningful they've had. References gladly provided." },
  { id: 12, type: "job", title: "Painting & Finishing Tech", org: "ProFinish Contractors", location: "Dallas, TX", commitment: "Full-time", pay: "$19–23/hr", tags: ["Trade Skill", "Equipment Provided", "Benefits"], category: "Construction", posted: "1 week ago", color: "#534AB7", initials: "PC", description: "Interior and exterior painting for commercial properties. We supply all equipment and materials. Prior painting experience a plus but not required. Will train dedicated workers." },
];

const CATEGORIES = ["All", "Logistics", "Culinary", "Construction", "Environment", "Social Services", "Transportation", "Community", "Customer Service"];

/**
 * Organization avatar component
 * @param {Object} props
 * @param {string} props.initials - Organization initials (2-3 chars)
 * @param {string} props.color - Brand color hex code
 * @returns {JSX.Element}
 */
function OrgAvatar({ initials, color }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: color + "18",
        border: `1.5px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Serif Display', serif",
        fontWeight: 700,
        fontSize: 15,
        color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/**
 * Card component for displaying a single job/volunteer listing
 * @param {ListingProps} props
 * @returns {JSX.Element}
 */
function ListingCard({ listing, onSelect }) {
  return (
    <div
      onClick={() => onSelect(listing)}
      style={{
        background: "#FDFAF5",
        border: "1px solid #E8E3D9",
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
        transition: "box-shadow .15s, border-color .15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)"; e.currentTarget.style.borderColor = "#D4CFC8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E8E3D9"; }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <OrgAvatar initials={listing.initials} color={listing.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 17,
                  fontWeight: 400,
                  color: "#1C1917",
                  margin: 0,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {listing.title}
              </h3>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#78716C" }}>{listing.org}</p>
            </div>
            <span
              style={{
                background: listing.type === "job" ? "#0F6E5612" : "#3B6D1112",
                color: listing.type === "job" ? "#0F6E56" : "#3B6D11",
                border: `1px solid ${listing.type === "job" ? "#0F6E5628" : "#3B6D1128"}`,
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              {listing.type === "job" ? "Job" : "Volunteer"}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px", fontSize: 13, color: "#57534E", margin: "10px 0 10px" }}>
            <span>📍 {listing.location}</span>
            <span>⏱ {listing.commitment}</span>
            <span style={{ fontWeight: 600, color: listing.type === "job" ? "#0F6E56" : "#78716C" }}>{listing.pay}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {listing.tags.map((t) => (
              <span key={t} style={{ background: "#F5F0E8", color: "#57534E", border: "1px solid #EAE5DC", borderRadius: 20, fontSize: 12, padding: "2px 10px" }}>
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#A8A29E" }}>Posted {listing.posted}</span>
            <Button
              style={{
                background: "#0F6E56",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 16px",
                height: "auto",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              View Details →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Detail drawer component showing full listing information
 * @param {DrawerProps} props
 * @returns {JSX.Element|null}
 */
function DetailDrawer({ listing, onClose }) {
  if (!listing) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,.5)", zIndex: 60, display: "flex", justifyContent: "flex-end" }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(480px, 100vw)",
          height: "100%",
          background: "#F5EFE3",
          overflowY: "auto",
          padding: "32px 32px 48px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            background: "#EDE8DF", border: "none", borderRadius: "50%",
            width: 34, height: 34, fontSize: 20, color: "#78716C",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ×
        </button>

        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
          <OrgAvatar initials={listing.initials} color={listing.color} />
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "#1C1917", margin: 0 }}>
              {listing.title}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#78716C" }}>{listing.org}</p>
          </div>
        </div>

        {/* Meta grid */}
        <div style={{ background: "#FDFAF5", border: "1px solid #E8E3D9", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[["Location", listing.location], ["Schedule", listing.commitment], ["Pay", listing.pay], ["Category", listing.category]].map(([k, v]) => (
            <div key={k}>
              <p style={{ margin: 0, fontSize: 11, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{k}</p>
              <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 600, color: "#1C1917" }}>{v}</p>
            </div>
          ))}
        </div>

        <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, margin: "0 0 10px", color: "#1C1917" }}>
          About this opportunity
        </h4>
        <p style={{ fontSize: 14, color: "#57534E", lineHeight: 1.75, margin: "0 0 24px" }}>
          {listing.description}
        </p>

        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, margin: "0 0 12px", color: "#1C1917" }}>Tags</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {listing.tags.map((t) => (
              <span key={t} style={{ background: "#F5F0E8", color: "#57534E", border: "1px solid #E8E3D9", borderRadius: 20, fontSize: 13, padding: "4px 12px" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Fair chance notice */}
        <div style={{ background: "#0F6E5610", border: "1px solid #0F6E5625", borderRadius: 12, padding: "14px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🤝</span>
          <p style={{ fontSize: 13, color: "#0F6E56", lineHeight: 1.6, margin: 0 }}>
            <strong>Fair-Chance Employer</strong> — This organization has committed to reviewing all applicants individually, regardless of criminal background.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button
            style={{
              flex: 1,
              background: "#0F6E56",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              padding: "13px",
              height: "auto",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Apply Now
          </Button>
          <Button
            style={{
              background: "transparent",
              color: "#0F6E56",
              border: "1.5px solid #0F6E5645",
              borderRadius: 10,
              fontSize: 15,
              padding: "13px 20px",
              height: "auto",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ♡ Save
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Job listing page component - displays filtered job and volunteer opportunities
 * @param {PageProps} props
 * @returns {JSX.Element}
 */
export default function JobListingPage({ searchQuery = "" }) {
  /** @type {string} - Current tab filter: "all", "job", or "volunteer" */
  const [tab, setTab] = useState("all");
  
  /** @type {string} - Current category filter: "All" or category name */
  const [category, setCategory] = useState("All");
  
  /** @type {string} - Current commitment filter: "all", "fulltime", or "parttime" */
  const [commitment, setCommitment] = useState("all");
  
  /** @type {JobListing|null} - Currently selected listing for detail drawer */
  const [selected, setSelected] = useState(null);
  
  /** @type {string} - Internal search query state */
  const [internalSearch, setInternalSearch] = useState(searchQuery);

  // Sync external search query from navbar
  useEffect(() => { setInternalSearch(searchQuery); }, [searchQuery]);

  /** @type {JobListing[]} - Filtered listings based on current filter state */
  const filtered = ALL_LISTINGS.filter((l) => {
    if (tab !== "all" && l.type !== tab) return false;
    if (category !== "All" && l.category !== category) return false;
    if (commitment === "fulltime" && l.commitment !== "Full-time") return false;
    if (commitment === "parttime" && l.commitment === "Full-time") return false;
    const q = internalSearch.toLowerCase();
    if (q && !l.title.toLowerCase().includes(q) && !l.org.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q) && !l.tags.some((t) => t.toLowerCase().includes(q))) return false;
    return true;
  });

  /** @type {number} - Count of job listings */
  const jobCount = ALL_LISTINGS.filter((l) => l.type === "job").length;
  
  /** @type {number} - Count of volunteer listings */
  const volCount = ALL_LISTINGS.filter((l) => l.type === "volunteer").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        select { font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; }
        select:focus { border-color: #0F6E5660 !important; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 80px", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, fontWeight: 400, color: "#1C1917", margin: "0 0 8px" }}>
            Opportunities
          </h1>
          <p style={{ fontSize: 14, color: "#78716C", margin: 0 }}>
            Every listing here is from an employer who has pledged fair-chance hiring.
          </p>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {/* Type tabs integrated into filter row */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "#EDE8DF",
              borderRadius: 10,
              padding: 3,
            }}
          >
            {[["all", "All"], ["job", "Jobs"], ["volunteer", "Volunteer"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTab(val)}
                style={{
                  borderRadius: 8,
                  fontSize: 12,
                  padding: "6px 14px",
                  border: "none",
                  background: tab === val ? "#FDFAF5" : "transparent",
                  color: tab === val ? "#1C1917" : "#78716C",
                  fontWeight: tab === val ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ background: "#FDFAF5", border: "1px solid #E8E3D9", borderRadius: 10, fontSize: 13, color: "#57534E", height: 40, padding: "0 12px" }}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            style={{ background: "#FDFAF5", border: "1px solid #E8E3D9", borderRadius: 10, fontSize: 13, color: "#57534E", height: 40, padding: "0 12px" }}
          >
            <option value="all">All Schedules</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time / Flexible</option>
          </select>

          {(category !== "All" || commitment !== "all" || internalSearch || tab !== "all") && (
            <button
              onClick={() => { setCategory("All"); setCommitment("all"); setInternalSearch(""); setTab("all"); }}
              style={{ background: "#D85A3012", color: "#D85A30", border: "1px solid #D85A3025", borderRadius: 10, fontSize: 12, padding: "0 12px", height: 40, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              Clear filters ×
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 13, color: "#78716C" }}>
            <strong style={{ color: "#1C1917" }}>{filtered.length}</strong> results
          </span>
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1C1917", margin: "0 0 10px" }}>
              No matches found
            </p>
            <p style={{ fontSize: 14, color: "#78716C" }}>Try changing your filters or search term.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 40, padding: "20px 0" }}>
  <p style={{ textAlign: "center" }}>
    <a
      href="https://services.onetcenter.org/"
      title="This site incorporates information from ONET Web Services. Click to learn more."
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://www.onetcenter.org/image/link/onet-in-it.svg"
        alt="ONET in-it"
        style={{ width: 130, height: 60, border: "none" }}
      />
    </a>
  </p>

  <p style={{ textAlign: "center", fontSize: 13, color: "#78716C", maxWidth: 600, margin: "0 auto" }}>
    This site incorporates information from
    <a
      href="https://services.onetcenter.org/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#0F6E56", marginLeft: 4 }}
    >
      O*NET Web Services
    </a>
    by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA).
    O*NET® is a trademark of USDOL/ETA.
  </p>
</div>


      <DetailDrawer listing={selected} onClose={() => setSelected(null)} />
        
    </>
  );
}
