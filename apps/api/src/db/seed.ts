// import getApp from "../app";
// import { getDb } from "./index";

// import {
//     users,
//     candidateProfiles,
//     candidateSkills,
//     candidateLanguages,
//     employerProfiles,
//     jobs,
//     jobSkills,
// } from "./schema";

// async function seed() {
//     await db.delete(jobSkills);
//     await db.delete(jobs);
//     await db.delete(candidateLanguages);
//     await db.delete(candidateSkills);
//     await db.delete(candidateProfiles);
//     await db.delete(employerProfiles);
//     await db.delete(users);

//     const insertedUsers = await db
//         .insert(users)
//         .values([
//             {
//                 email: "user@test.com",
//                 passwordHash: "user123",
//                 role: "candidate",
//             },
//             {
//                 email: "company@test.com",
//                 passwordHash: "company123",
//                 role: "employer",
//             },
//         ])
//         .returning();

//     const candidateUser = insertedUsers[0];
//     const employerUser = insertedUsers[1];

//     const insertedCandidates = await db
//         .insert(candidateProfiles)
//         .values({
//             userId: candidateUser.id,
//             firstName: "Test",
//             lastName: "1",
//             phone: "1234567890",
//             county: "King",
//             state: "WA",
//             bio: "Junior developer interested in building accessible web applications.",
//             availability: "full-time",
//             preferredJobType: "hybrid",
//         })
//         .returning();

//     const candidate = insertedCandidates[0];

//     await db.insert(candidateSkills).values([
//         {
//             candidateId: candidate.id,
//             skill: "JavaScript",
//         },
//         {
//             candidateId: candidate.id,
//             skill: "React",
//         },
//         {
//             candidateId: candidate.id,
//             skill: "SQL",
//         },
//     ]);

//     await db.insert(candidateLanguages).values([
//         {
//             candidateId: candidate.id,
//             language: "English",
//         },
//         {
//             candidateId: candidate.id,
//             language: "Spanish",
//         },
//     ]);

//     const insertedEmployers = await db
//         .insert(employerProfiles)
//         .values({
//             userId: employerUser.id,
//             companyName: "Tech Startup",
//             contactName: "Test Manager",
//             contactEmail: "testManager@techStartup.org",
//             phone: "2061345789",
//             county: "King",
//             state: "WA",
//             industry: "Technology",
//             website: "https://testwebsite@techStartup.org",

//         })
//         .returning();

//     const employer = insertedEmployers[0];

//     const insertedJobs = await db
//         .insert(jobs)
//         .values({
//             employerId: employer.id,
//             title: "Frontend Developer",
//             description: "Build responsive web interfaces.",
//             city: "Seattle",
//             county: "King",
//             state: "WA",
//             employmentType: "full-time",
//         })
//         .returning();

//     const job = insertedJobs[0];

//     await db.insert(jobSkills).values([
//         {
//             jobId: job.id,
//             skill: "JavaScript",
//         },
//         {
//             jobId: job.id,
//             skill: "React",
//         },
//     ]);

//     console.log("Seed data inserted successfully.");
// }

// seed();