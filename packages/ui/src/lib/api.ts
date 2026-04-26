// Uses Vite's import.meta.env or Next's process.env depending on the environment
const API_BASE_URL = "http://localhost:8787";

export const api = {
  // --- USERS ---
  createUser: async (data: { email: string; passwordHash: string; role: string }) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  // --- CANDIDATES ---
  createCandidate: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save profile");
    return res.json();
  },

  // --- JOBS ---
  searchMatchedJobs: async (candidateId: number, county: string) => {
    const res = await fetch(`${API_BASE_URL}/jobs/search-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, county }),
    });
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
  },
};