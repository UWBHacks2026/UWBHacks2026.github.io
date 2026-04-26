//search file

// The following code was written by Calude.
// it look alright but unsure.

/**
 * searchUSAJobs.ts
 *
 * Searches the USAJobs API for federal job listings matching a set of skills
 * within a specified Washington State county.
 *
 * Credentials are read from environment variables:
 *   USAJOBS_API_KEY   — your Authorization Key from developer.usajobs.gov
 *   USAJOBS_EMAIL     — the email address you registered with USAJobs
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape returned by your JobListingPage component */
export interface JobListing {
  MatchedObjectId: string;
  id: string;
  type: "job";
  title: string;
  org: string;
  location: string;
  commitment: string;
  pay: string;
  tags: string[];
  category: string;
  posted: string;
  color: string;
  initials: string;
  description: string;
  applyUrl: string;
}

/** Subset of the USAJobs MatchedObjectDescriptor we actually use */
interface USAJobsDescriptor {
  MatchedObjectId: string;
  PositionTitle: string;
  OrganizationName: string;
  PositionLocation: Array<{ LocationName: string }>;
  PositionLocationDisplay: string;
  PositionSchedule: Array<{ Name: string }>;
  PositionRemuneration: Array<{
    MinimumRange: string;
    MaximumRange: string;
    RateIntervalCode: string; // "PA" = annual, "PH" = hourly, "WC" = without compensation
  }>;
  PublicationStartDate: string; // ISO 8601
  JobCategory: Array<{ Name: string }>;
  UserArea?: {
    Details?: {
      JobSummary?: string;
      HiringPath?: string[];
      TotalOpenings?: string;
    };
  };
  ApplyURI: string[];
}

interface USAJobsSearchResult {
  SearchResult: {
    SearchResultCount: number;
    SearchResultItems: Array<{
      MatchedObjectDescriptor: USAJobsDescriptor;
    }>;
  };
}

// ---------------------------------------------------------------------------
// WA County → Major Cities Map
// ---------------------------------------------------------------------------

const WA_COUNTY_CITIES: Record<string, string[]> = {
  "Adams County":       ["Ritzville", "Othello"],
  "Asotin County":      ["Clarkston", "Asotin"],
  "Benton County":      ["Kennewick", "Richland", "Prosser", "West Richland"],
  "Chelan County":      ["Wenatchee", "Leavenworth", "Chelan"],
  "Clallam County":     ["Port Angeles", "Sequim", "Forks"],
  "Clark County":       ["Vancouver", "Camas", "Battle Ground", "Washougal"],
  "Columbia County":    ["Dayton"],
  "Cowlitz County":     ["Longview", "Kelso", "Castle Rock"],
  "Douglas County":     ["East Wenatchee", "Waterville"],
  "Ferry County":       ["Republic"],
  "Franklin County":    ["Pasco", "Connell"],
  "Garfield County":    ["Pomeroy"],
  "Grant County":       ["Moses Lake", "Ephrata", "Quincy"],
  "Grays Harbor County":["Aberdeen", "Hoquiam", "Montesano", "Ocean Shores"],
  "Island County":      ["Oak Harbor", "Coupeville", "Langley"],
  "Jefferson County":   ["Port Townsend"],
  "King County":        ["Seattle", "Bellevue", "Redmond", "Kirkland", "Renton", "Kent", "Auburn", "Federal Way", "Sammamish"],
  "Kitsap County":      ["Bremerton", "Port Orchard", "Bainbridge Island", "Poulsbo"],
  "Kittitas County":    ["Ellensburg", "Cle Elum"],
  "Klickitat County":   ["Goldendale", "White Salmon"],
  "Lewis County":       ["Centralia", "Chehalis"],
  "Lincoln County":     ["Davenport"],
  "Mason County":       ["Shelton"],
  "Okanogan County":    ["Okanogan", "Omak", "Twisp", "Winthrop"],
  "Pacific County":     ["South Bend", "Raymond", "Long Beach"],
  "Pend Oreille County":["Newport"],
  "Pierce County":      ["Tacoma", "Lakewood", "Puyallup", "Gig Harbor", "Bonney Lake", "Sumner"],
  "San Juan County":    ["Friday Harbor"],
  "Skagit County":      ["Mount Vernon", "Burlington", "Anacortes", "Sedro-Woolley"],
  "Skamania County":    ["Stevenson"],
  "Snohomish County":   ["Everett", "Marysville", "Lynnwood", "Edmonds", "Bothell", "Mukilteo", "Monroe"],
  "Spokane County":     ["Spokane", "Spokane Valley", "Cheney"],
  "Stevens County":     ["Colville", "Chewelah"],
  "Thurston County":    ["Olympia", "Lacey", "Tumwater", "Yelm"],
  "Wahkiakum County":   ["Cathlamet"],
  "Walla Walla County": ["Walla Walla", "College Place"],
  "Whatcom County":     ["Bellingham", "Ferndale", "Lynden", "Blaine"],
  "Whitman County":     ["Pullman", "Colfax"],
  "Yakima County":      ["Yakima", "Selah", "Union Gap", "Grandview", "Sunnyside"],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORG_COLOR_PALETTE = [
  "#0F6E56", "#185FA5", "#BA7517",
  "#3B6D11", "#993556", "#534AB7", "#D85A30",
];

/**
 * Deterministically assigns one of the brand colors based on the org name,
 * so the same organization always gets the same color across renders.
 */
function orgColor(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) & 0xffff;
  }
  return ORG_COLOR_PALETTE[hash % ORG_COLOR_PALETTE.length];
}

/**
 * Derives 2–3 uppercase initials from an organization name using
 * the first letter of each capitalized word, capped at 3 characters.
 */
function orgInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
  return initials || name.slice(0, 2).toUpperCase();
}

/**
 * Converts an ISO 8601 date string to a human-readable relative label,
 * e.g. "Today", "2 days ago", "1 week ago".
 */
function relativePostedDate(isoDate: string): string {
  const days = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 86_400_000
  );
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7)  return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

/**
 * Builds a human-readable pay string from the USAJobs remuneration object.
 * Examples: "$18–21/hr", "$55,000–70,000/yr", "Volunteer"
 */
function formatPay(
  remuneration: USAJobsDescriptor["PositionRemuneration"]
): string {
  if (!remuneration?.length) return "See posting";

  const { MinimumRange, MaximumRange, RateIntervalCode } = remuneration[0];

  if (RateIntervalCode === "WC") return "Volunteer";

  const fmt = (n: string) =>
    Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const suffix = RateIntervalCode === "PH" ? "/hr" : "/yr";
  const min = fmt(MinimumRange);
  const max = fmt(MaximumRange);

  return min === max ? `$${min}${suffix}` : `$${min}–${max}${suffix}`;
}

/**
 * Normalizes commitment labels from USAJobs to match the filter values
 * used by JobListingPage ("Full-time", "Part-time", "Flexible").
 */
function formatCommitment(schedule: USAJobsDescriptor["PositionSchedule"]): string {
  const raw = schedule?.[0]?.Name ?? "";
  if (/full/i.test(raw)) return "Full-time";
  if (/part/i.test(raw)) return "Part-time";
  return "Flexible";
}

/**
 * Converts a USAJobs HiringPath code to a readable tag label.
 * Non-public paths are surfaced as tags so users know about eligibility.
 */
const HIRING_PATH_LABELS: Record<string, string> = {
  "public":            "Open to Public",
  "fed-transitioning": "Military Transition",
  "disability":        "Schedule A",
  "native":            "Native American",
  "student":           "Students / Recent Grads",
  "ses":               "Senior Executive Service",
  "peace-corps":       "Peace Corps / AmeriCorps",
  "fed-internal":      "Federal Employees",
  "overseas":          "Overseas Eligible",
};

function buildTags(descriptor: USAJobsDescriptor): string[] {
  const tags: string[] = [];

  const hiringPaths = descriptor.UserArea?.Details?.HiringPath ?? [];
  for (const path of hiringPaths) {
    const label = HIRING_PATH_LABELS[path];
    if (label) tags.push(label);
  }

  const schedule = descriptor.PositionSchedule?.[0]?.Name ?? "";
  if (/multiple/i.test(schedule)) tags.push("Multiple Schedules");

  const openings = descriptor.UserArea?.Details?.TotalOpenings;
  if (openings && Number(openings) > 1) tags.push(`${openings} Openings`);

  return tags;
}

// ---------------------------------------------------------------------------
// Core parser
// ---------------------------------------------------------------------------

function parseDescriptor(descriptor: USAJobsDescriptor): JobListing {
  return {
    id:         descriptor.MatchedObjectId,
    type:       "job",
    title:      descriptor.PositionTitle,
    org:        descriptor.OrganizationName,
    location:   descriptor.PositionLocation?.[0]?.LocationName
                  ?? descriptor.PositionLocationDisplay
                  ?? "Washington, WA",
    commitment: formatCommitment(descriptor.PositionSchedule),
    pay:        formatPay(descriptor.PositionRemuneration),
    tags:       buildTags(descriptor),
    category:   descriptor.JobCategory?.[0]?.Name ?? "General",
    posted:     relativePostedDate(descriptor.PublicationStartDate),
    description:descriptor.UserArea?.Details?.JobSummary ?? "",
    color:      orgColor(descriptor.OrganizationName),
    initials:   orgInitials(descriptor.OrganizationName),
    applyUrl:   descriptor.ApplyURI?.[0] ?? "",
  };
}

// ---------------------------------------------------------------------------
// API fetch for a single city
// ---------------------------------------------------------------------------

const USAJOBS_BASE = "https://data.usajobs.gov/api/search";

async function fetchJobsForCity(
  keyword: string,
  city: string,
  apiKey: string,
  email: string,
  resultsPerPage = 25
): Promise<USAJobsDescriptor[]> {
  const params = new URLSearchParams({
    Keyword:        keyword,
    LocationName:   `${city}, WA`,
    ResultsPerPage: String(resultsPerPage),
    Fields:         "Min",              // include UserArea details
  });

  const response = await fetch(`${USAJOBS_BASE}?${params.toString()}`, {
    headers: {
      "Host":              "data.usajobs.gov",
      "User-Agent":        email,
      "Authorization-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `USAJobs API error for "${city}": ${response.status} ${response.statusText}`
    );
  }

  const data: USAJobsSearchResult = await response.json();
  return data.SearchResult.SearchResultItems.map(
    (item) => item.MatchedObjectDescriptor
  );
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------

/**
 * Searches USAJobs for federal job listings matching the given skills
 * within the specified Washington State county.
 *
 * @param skills     - Array of skill keywords (e.g. ["Python", "data analysis"])
 * @param countyName - Full WA county name (e.g. "King County")
 * @param options    - Optional overrides for credentials and result limits
 * @returns          - Deduplicated, parsed JobListing array ready for your UI
 *
 * @example
 * const jobs = await searchUSAJobsByCounty(
 *   ["nursing", "patient care"],
 *   "Pierce County"
 * );
 */
export async function searchUSAJobsByCounty(
  skills: string[],
  countyName: string,
  options: {
    apiKey?: string;
    email?: string;
    resultsPerPage?: number;
  } = {}
): Promise<JobListing[]> {
  // --- Credentials ---
  const apiKey = options.apiKey ?? process.env.USAJOBS_API_KEY;
  const email  = options.email  ?? process.env.USAJOBS_EMAIL;

  if (!apiKey || !email) {
    throw new Error(
      "Missing USAJobs credentials. Set USAJOBS_API_KEY and USAJOBS_EMAIL " +
      "as environment variables, or pass them via the options parameter."
    );
  }

  // --- Validate county ---
  const normalizedCounty = countyName.trim();
  const cities = WA_COUNTY_CITIES[normalizedCounty];

  if (!cities) {
    const available = Object.keys(WA_COUNTY_CITIES).join(", ");
    throw new Error(
      `Unknown WA county: "${normalizedCounty}". ` +
      `Available counties: ${available}`
    );
  }

  if (skills.length === 0) {
    throw new Error("skills array must contain at least one keyword.");
  }

  // USAJobs treats space-separated words as AND within the keyword field.
  // Joining skills with spaces searches for listings containing all terms.
  const keyword = skills.join(" ");

  // --- Fetch all cities in parallel ---
  const cityResults = await Promise.all(
    cities.map((city) =>
      fetchJobsForCity(
        keyword,
        city,
        apiKey,
        email,
        options.resultsPerPage ?? 25
      )
    )
  );

  // --- Deduplicate by MatchedObjectId across cities ---
  const seen = new Set<string>();
  const unique: USAJobsDescriptor[] = [];

  for (const descriptors of cityResults) {
    for (const descriptor of descriptors) {
      if (!seen.has(descriptor.MatchedObjectId)) {
        seen.add(descriptor.MatchedObjectId);
        unique.push(descriptor);
      }
    }
  }

  // --- Parse into JobListing objects ---
  return unique.map(parseDescriptor);
}
