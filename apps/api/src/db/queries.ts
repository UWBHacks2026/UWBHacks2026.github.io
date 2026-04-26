import { eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  users,
  candidateProfiles,
  candidateSkills,
  candidateLanguages,
  employerProfiles,
  jobs,
  jobSkills,
} from "./schema";

export function getUsers(env: D1Database) {
  const database = getDb(env);
  return database.select().from(users);
}

export function getCandidates(env: D1Database) {
  const database = getDb(env);
  return database.select().from(candidateProfiles);
}

export function getEmployers(env: D1Database) {
  const database = getDb(env);
  return database.select().from(employerProfiles);
}

export function getJobs(env: D1Database) {
  const database = getDb(env);
  return database.select().from(jobs);
}

export function getCandidateSkills(env: D1Database, candidateId: number) {
  const database = getDb(env);

  return database
    .select()
    .from(candidateSkills)
    .where(eq(candidateSkills.candidateId, candidateId));
}

export function getCandidateLanguages(env: D1Database, candidateId: number) {
  const database = getDb(env);

  return database
    .select()
    .from(candidateLanguages)
    .where(eq(candidateLanguages.candidateId, candidateId));
}

export function getJobSkills(env: D1Database, jobId: number) {
  const database = getDb(env);

  return database
    .select()
    .from(jobSkills)
    .where(eq(jobSkills.jobId, jobId));
}

export function createUser(
  env: D1Database,
  data: {
    email: string;
    passwordHash: string;
    role: "candidate" | "employer";
  }
) {
  const database = getDb(env);

  return database
    .insert(users)
    .values({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
    })
    .returning();
}

export function createCandidateProfile(
  env: D1Database,
  data: {
    userId: number;
    firstName: string;
    lastName: string;
    phone?: string;
    county: string;
    state?: string;
    bio?: string;
    availability?: "full-time" | "part-time";
    preferredJobType?: "remote" | "hybrid" | "on-site";
  }
) {
  const database = getDb(env);

  return database
    .insert(candidateProfiles)
    .values({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      county: data.county,
      state: data.state ?? "WA",
      bio: data.bio,
      availability: data.availability,
      preferredJobType: data.preferredJobType,
    })
    .returning();
}

export function createEmployerProfile(
  env: D1Database,
  data: {
    userId: number;
    companyName: string;
    contactName: string;
    contactEmail: string;
    phone?: string;
    county: string;
    state?: string;
    industry?: string;
    website?: string;
  }
) {
  const database = getDb(env);

  return database
    .insert(employerProfiles)
    .values({
      userId: data.userId,
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      phone: data.phone,
      county: data.county,
      state: data.state ?? "WA",
      industry: data.industry,
      website: data.website,
    })
    .returning();
}

export function createJob(
  env: D1Database,
  data: {
    employerId: number;
    title: string;
    description?: string;
    city?: string;
    county: string;
    state?: string;
    employmentType?: "full-time" | "part-time";
  }
) {
  const database = getDb(env);

  return database
    .insert(jobs)
    .values({
      employerId: data.employerId,
      title: data.title,
      description: data.description,
      city: data.city,
      county: data.county,
      state: data.state ?? "WA",
      employmentType: data.employmentType,
    })
    .returning();
}

export function addCandidateSkill(
  env: D1Database,
  data: {
    candidateId: number;
    skill: string;
  }
) {
  const database = getDb(env);

  return database.insert(candidateSkills).values(data).returning();
}

export function addCandidateLanguage(
  env: D1Database,
  data: {
    candidateId: number;
    language: string;
  }
) {
  const database = getDb(env);

  return database.insert(candidateLanguages).values(data).returning();
}

export function addJobSkill(
  env: D1Database,
  data: {
    jobId: number;
    skill: string;
  }
) {
  const database = getDb(env);

  return database.insert(jobSkills).values(data).returning();
}

export async function createCandidateWithSkills(
  env: D1Database,
  data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    county: string;
    state?: string;
    bio?: string;
    availability?: "full-time" | "part-time";
    preferredJobType?: "remote" | "hybrid" | "on-site";
    skills: string[];
    languages: string[];
  }
) {
  const database = getDb(env);

  const insertedUsers = await database
    .insert(users)
    .values({
      email: data.email,
      passwordHash: data.passwordHash,
      role: "candidate",
    })
    .returning();

  const user = insertedUsers[0];

  const insertedCandidates = await database
    .insert(candidateProfiles)
    .values({
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      county: data.county,
      state: data.state ?? "WA",
      bio: data.bio,
      availability: data.availability,
      preferredJobType: data.preferredJobType,
    })
    .returning();

  const candidate = insertedCandidates[0];

  if (data.skills.length > 0) {
    await database.insert(candidateSkills).values(
      data.skills.map((skill) => ({
        candidateId: candidate.id,
        skill,
      }))
    );
  }

  if (data.languages.length > 0) {
    await database.insert(candidateLanguages).values(
      data.languages.map((language) => ({
        candidateId: candidate.id,
        language,
      }))
    );
  }

  return {
    user,
    candidate,
    skills: data.skills,
    languages: data.languages,
  };
}

export async function createEmployerWithJob(
  env: D1Database,
  data: {
    email: string;
    passwordHash: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    phone?: string;
    county: string;
    state?: string;
    industry?: string;
    website?: string;
    jobTitle: string;
    jobDescription?: string;
    city?: string;
    jobCounty: string;
    jobState?: string;
    employmentType?: "full-time" | "part-time";
    skills: string[];
  }
) {
  const database = getDb(env);

  const insertedUsers = await database
    .insert(users)
    .values({
      email: data.email,
      passwordHash: data.passwordHash,
      role: "employer",
    })
    .returning();

  const user = insertedUsers[0];

  const insertedEmployers = await database
    .insert(employerProfiles)
    .values({
      userId: user.id,
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      phone: data.phone,
      county: data.county,
      state: data.state ?? "WA",
      industry: data.industry,
      website: data.website,
    })
    .returning();

  const employer = insertedEmployers[0];

  const insertedJobs = await database
    .insert(jobs)
    .values({
      employerId: employer.id,
      title: data.jobTitle,
      description: data.jobDescription,
      city: data.city,
      county: data.jobCounty,
      state: data.jobState ?? "WA",
      employmentType: data.employmentType,
    })
    .returning();

  const job = insertedJobs[0];

  if (data.skills.length > 0) {
    await database.insert(jobSkills).values(
      data.skills.map((skill) => ({
        jobId: job.id,
        skill,
      }))
    );
  }

  return {
    user,
    employer,
    job,
    skills: data.skills,
  };
}

export async function matchCandidatesToJobs(env: D1Database) {
  const database = getDb(env);

  const candidates = await database.select().from(candidateProfiles);
  const allJobs = await database.select().from(jobs);

  const matches = [];

  for (const job of allJobs) {
    const requiredSkills = await database
      .select()
      .from(jobSkills)
      .where(eq(jobSkills.jobId, job.id));

    const jobSkillList = requiredSkills.map((row: { skill: string }) =>
      row.skill.toLowerCase().trim()
    );

    for (const candidate of candidates) {
      const candidateSkillRows = await database
        .select()
        .from(candidateSkills)
        .where(eq(candidateSkills.candidateId, candidate.id));

      const candidateSkillList = candidateSkillRows.map(
        (row: { skill: string }) => row.skill.toLowerCase().trim()
      );

      const matchedSkills = jobSkillList.filter((skill: string) =>
        candidateSkillList.includes(skill)
      );

      const score =
        jobSkillList.length === 0
          ? 0
          : Math.round((matchedSkills.length / jobSkillList.length) * 100);

      matches.push({
        jobId: job.id,
        jobTitle: job.title,
        candidateId: candidate.id,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        matchedSkills,
        totalJobSkills: jobSkillList.length,
        score,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}