import { Hono } from "hono";
import {
  getCandidates,
  getCandidateSkills,
  getCandidateLanguages,
  createCandidateWithSkills,
} from "../db/queries";
import getApp from "../app";
import { extractSkills } from "./dataCleaning";

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
    candidate: result,
  });
});