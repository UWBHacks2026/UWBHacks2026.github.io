import {
  getCandidates,
  getCandidateSkills,
  getCandidateLanguages,
  createCandidateWithSkills,
  updateCandidateWithSkills,
} from "../db/queries";
import getApp from "../app";
import { extractSkills } from "./dataCleaning";
import { getDb } from "../db";
import { candidateProfiles, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const candidatesRoute = getApp();

function cleanCommaList(input?: string): string[] {
  if (!input) return [];

  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

candidatesRoute.get("/", async (c) => {
  const candidates = await getCandidates(c.env.DB);
  return c.json(candidates);
});

candidatesRoute.get("/:id/skills", async (c) => {
  const candidateId = Number(c.req.param("id"));
  const skills = await getCandidateSkills(c.env.DB, candidateId);
  return c.json(skills);
});

candidatesRoute.get("/:id/languages", async (c) => {
  const candidateId = Number(c.req.param("id"));
  const languages = await getCandidateLanguages(c.env.DB, candidateId);
  return c.json(languages);
});

candidatesRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const skills = extractSkills(body.skills);
    const languages = cleanCommaList(body.languages);

    const result = await createCandidateWithSkills(c.env.DB, {
      email: body.email,
      passwordHash: body.passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      county: body.county,
      state: body.state ?? "WA",
      bio: body.bio,
      availability: body.availability,
      preferredJobType: body.preferredJobType,
      skills,
      languages,
    });

    return c.json({
      message: "Candidate created successfully",
      user: result.user,
      candidate: result.candidate,
    });
  } catch (err: any) {
    console.error("Failed to create candidate:", err);

    if (err.message?.includes("UNIQUE constraint failed")) {
      return c.json({ error: "An account with this email already exists." }, 409);
    }
    
    return c.json({ error: "Internal server error while creating profile." }, 500);
  }
});

candidatesRoute.get("/by-email/:email", async (c) => {
  const email = c.req.param("email");
  const db = getDb(c.env.DB);
  
  const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) return c.json({ error: "User not found" }, 404);
  const user = userResult[0];

  const profileResult = await db.select().from(candidateProfiles).where(eq(candidateProfiles.userId, user.id)).limit(1);
  if (profileResult.length === 0) return c.json({ error: "Profile not found" }, 404);
  const profile = profileResult[0];

  const skills = await getCandidateSkills(c.env.DB, profile.id);

  return c.json({
    user,
    profile,
    skills: skills.map(s => s.skill),
  });
});

candidatesRoute.put("/:id", async (c) => {
  const candidateId = Number(c.req.param("id"));
  const body = await c.req.json();

  const skills = extractSkills(body.skills);
  const languages = cleanCommaList(body.languages);

  try {
    const result = await updateCandidateWithSkills(c.env.DB, candidateId, {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      county: body.county,
      state: body.state,
      bio: body.bio,
      skills,
      languages,
    });

    return c.json({
      message: "Candidate updated successfully",
      candidate: result.candidate,
    });
  } catch (error) {
    console.error("Update error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});