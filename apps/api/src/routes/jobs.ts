import getApp from "../app";
import {
    getJobSkills,
    createJobFromApi,
    getCandidateSkills,
} from "../db/queries";
import { searchUSAJobsByCounty } from "./searchFile";
import { extractSkills } from "./dataCleaning";

export const jobsRoute = getApp();

jobsRoute.post("/search-match", async (c) => {
    const body = await c.req.json();

    const candidateId = Number(body.candidateId);
    const county = body.county;

    const candidateSkillRows = await getCandidateSkills(c.env.DB, candidateId);

    const candidateSkills = candidateSkillRows.map((row) =>
        row.skill.toLowerCase().trim()
    );

    const usaJobs = await searchUSAJobsByCounty(candidateSkills, county, {
        apiKey: c.env.USAJOBS_API_KEY,
        email: c.env.USAJOBS_EMAIL,
    });

    const matchedJobs = [];

    for (const job of usaJobs) {
        const extractedJobSkills = extractSkills(
            `${job.title} ${job.description} ${job.category} ${job.tags.join(" ")}`
        );

        const savedJob = await createJobFromApi(c.env.DB, {
            externalJobId: job.id,
            title: job.title,
            org: job.org,
            description: job.description,
            county,
            location: job.location,
            applyUrl: job.applyUrl,
            pay: job.pay,
            category: job.category,
            posted: job.posted,
            employmentType:
                job.commitment === "Full-time"
                    ? "full-time"
                    : job.commitment === "Part-time"
                        ? "part-time"
                        : undefined,
            skills: extractedJobSkills,
        });

        const jobSkillList = extractedJobSkills.map((skill) =>
            skill.toLowerCase().trim()
        );

        const matchedSkills = jobSkillList.filter((skill) =>
            candidateSkills.includes(skill)
        );

        const score =
            jobSkillList.length === 0
                ? 0
                : Math.round((matchedSkills.length / jobSkillList.length) * 100);

        matchedJobs.push({
            job: savedJob.job,
            matchedSkills,
            totalJobSkills: jobSkillList.length,
            score,
        });
    }

    return c.json({
        candidateId,
        totalJobsFound: usaJobs.length,
        matches: matchedJobs.sort((a, b) => b.score - a.score),
    });
});