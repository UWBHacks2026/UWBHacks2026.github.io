import {
    getUsers,
    getCandidates,
    getEmployers,
    getJobs,
    getCandidateSkills,
    getCandidateLanguages,
    getJobSkills,
    matchCandidatesToJobs,
} from "./queries";

async function main() {
    const users = await getUsers();
    const candidates = await getCandidates();
    const employers = await getEmployers();
    const jobs = await getJobs();
    const matches = await matchCandidatesToJobs()

    console.log("Users:", users);
    console.log("Candidates:", candidates);
    console.log("Employers:", employers);
    console.log("Jobs:", jobs);

    if (candidates.length > 0) {
        console.log("Candidate Skills:", await getCandidateSkills(candidates[0].id));
        console.log("Candidate Languages:", await getCandidateLanguages(candidates[0].id));
    }

    if (jobs.length > 0) {
        console.log("Job Skills:", await getJobSkills(jobs[0].id));
    }

    console.log("Matches:", matches);
}

main();