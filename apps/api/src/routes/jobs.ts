import getApp from "../app";
import {
    createJobFromApi,
    getCandidateSkills,
} from "../db/queries";
import { searchUSAJobsByCounty } from "./searchFile";
import { extractSkills } from "./dataCleaning";

export const jobsRoute = getApp();

jobsRoute.post("/search-match", async (c) => {
    try {
        const body = await c.req.json();

        const candidateId = body.candidateId ? Number(body.candidateId) : null;
        const county = body.county;

        let searchKeywords = ["Entry Level"];
        let candidateSkills: string[] = [];

        if (candidateId) {  
            const candidateSkillRows = await getCandidateSkills(c.env.DB, candidateId);
            candidateSkills = candidateSkillRows.map((row) => row.skill.toLowerCase().trim());

            if (candidateSkills.length > 0) {
                searchKeywords = candidateSkills;
            }
        } else {
            candidateSkills = ["Communication"];
        }

        const usaJobs = await searchUSAJobsByCounty(candidateSkills, county, {
            apiKey: c.env.USAJOBS_API_KEY,
            email: c.env.USAJOBS_EMAIL,
        });

        const matchedJobs = [];

        for (const job of usaJobs) {
            const rawId = job.id || job.MatchedObjectId;

            if (!rawId) {
                console.warn("Skipping job due to missing ID:", job.title);

                continue;
            }

            const extractedJobSkills = extractSkills(
                `${job.title} ${job.description} ${job.category} ${job.tags.join(" ")}`
            );

            const savedJob = await createJobFromApi(c.env.DB, {
                externalJobId: String(rawId),
                title: job.title || "Unknown Title",
                org: job.org || "Unknown Organization",
                description: job.description || "",
                county,
                location: job.location || county,
                applyUrl: job.applyUrl || "",
                pay: job.pay || "Unspecified",
                category: job.category || "General",
                posted: job.posted || "Recently",
                employmentType:
                    job.commitment === "Full-time"
                        ? "full-time"
                        : job.commitment === "Part-time"
                            ? "part-time"
                            : undefined,
                skills: extractedJobSkills,
            });

            let score = 0;
            let matchedSkills: string[] = [];

            if (candidateId && candidateSkills.length > 0) {
                const jobSkillList = extractedJobSkills.map((s) => s.toLowerCase().trim());
                matchedSkills = jobSkillList.filter((s) => candidateSkills.includes(s));
                score = jobSkillList.length === 0 ? 0 : Math.round((matchedSkills.length / jobSkillList.length) * 100);
            }

            matchedJobs.push({
                job: savedJob.job,
                matchedSkills: matchedSkills.length > 0 ? matchedSkills : extractedJobSkills.slice(0, 3),
                score,
            });
        }

        return c.json({
            totalJobsFound: usaJobs.length,
            matches: matchedJobs.sort((a, b) => b.score - a.score),
        });
    } catch (err: any) {
        console.error("USAJobs Search Error:", err);

        return c.json({
            error: "Failed to load matched jobs. Please try again."
        }, 500)
    }
});