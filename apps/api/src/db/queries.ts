import { db } from "./index";
import {
    users,
    candidateProfiles,
    employerProfiles,
    candidateSkills,
    candidateLanguages,
    jobs,
    jobSkills,
} from "./schema";
import { eq } from "drizzle-orm";

export type UserRole = "candidate" | "employer";

export function createUser(
    email: string,
    passwordHash: string,
    role: UserRole
) {
    return db
        .insert(users)
        .values({
            email,
            passwordHash,
            role,
        })
        .returning();
}

export function createCandidateProfile(data: {
    userId: number;
    firstName: string;
    lastName: string;
    phone?: string;
    county: string;
    state?: string;
    bio?: string;
    availability?: "full-time" | "part-time";
    preferredJobType?: "remote" | "hybrid" | "on-site";
}) {
    return db
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

export function createEmployerProfile(data: {
    userId: number;
    companyName: string;
    contactName: string;
    contactEmail: string;
    phone?: string;
    county: string;
    state?: string;
    industry?: string;
    website?: string;
}) {
    return db
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

export function addCandidateSkill(candidateId: number, skill: string) {
    return db
        .insert(candidateSkills)
        .values({
            candidateId,
            skill,
        })
        .returning();
}

export function addCandidateLanguage(candidateId: number, language: string) {
    return db
        .insert(candidateLanguages)
        .values({
            candidateId,
            language,
        })
        .returning();
}

export function createJob(data: {
    employerId: number;
    title: string;
    description?: string;
    city?: string;
    county: string;
    state?: string;
    employmentType?: "full-time" | "part-time";
}) {
    return db
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

export function addJobSkill(jobId: number, skill: string) {
    return db
        .insert(jobSkills)
        .values({
            jobId,
            skill,
        })
        .returning();
}

export function getUsers() {
    return db.select().from(users);
}

export function getCandidates() {
    return db.select().from(candidateProfiles);
}

export function getEmployers() {
    return db.select().from(employerProfiles);
}

export function getJobs() {
    return db.select().from(jobs);
}

export function getCandidateSkills(candidateId: number) {
    return db
        .select()
        .from(candidateSkills)
        .where(eq(candidateSkills.candidateId, candidateId));
}

export function getCandidateLanguages(candidateId: number) {
    return db
        .select()
        .from(candidateLanguages)
        .where(eq(candidateLanguages.candidateId, candidateId));
}

export function getJobSkills(jobId: number) {
    return db.select().from(jobSkills).where(eq(jobSkills.jobId, jobId));
}

export async function matchCandidatesToJobs() {
    const allCandidates = await db.select().from(candidateProfiles);
    const allJobs = await db.select().from(jobs);

    const results = [];

    for (const job of allJobs) {
        const requiredSkills = await db
            .select()
            .from(jobSkills)
            .where(eq(jobSkills.jobId, job.id));

        for (const candidate of allCandidates) {
            const candidateSkillRows = await db
                .select()
                .from(candidateSkills)
                .where(eq(candidateSkills.candidateId, candidate.id));

            const candidateSkillList = candidateSkillRows.map((row) =>
                row.skill.toLowerCase().trim()
            );

            const jobSkillList = requiredSkills.map((row) =>
                row.skill.toLowerCase().trim()
            );

            const matchedSkills = jobSkillList.filter((skill) =>
                candidateSkillList.includes(skill)
            );

            const score =
                jobSkillList.length === 0
                    ? 0
                    : Math.round((matchedSkills.length / jobSkillList.length) * 100);

            results.push({
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

    return results.sort((a, b) => b.score - a.score);
}