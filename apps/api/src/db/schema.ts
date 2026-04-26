import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["candidate", "employer"] }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const candidateProfiles = sqliteTable("candidate_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  county: text("county").notNull(),
  state: text("state").notNull().default("WA"),

  bio: text("bio"),
  availability: text("availability", { enum: ["full-time", "part-time"] }),
  preferredJobType: text("preferred_job_type", {
    enum: ["remote", "hybrid", "on-site"],
  }),
});

export const employerProfiles = sqliteTable("employer_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  phone: text("phone"),
  county: text("county").notNull(),
  state: text("state").notNull().default("WA"),

  industry: text("industry"),
  website: text("website"),
});

export const candidateSkills = sqliteTable("candidate_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id").notNull().references(() => candidateProfiles.id),
  skill: text("skill").notNull(),
});

export const candidateLanguages = sqliteTable("candidate_languages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id").notNull().references(() => candidateProfiles.id),
  language: text("language").notNull(),
});

export const candidateExperience = sqliteTable("candidate_experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id").notNull().references(() => candidateProfiles.id),
  title: text("title").notNull(),
  employer: text("employer").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isCurrent: integer("is_current", { mode: "boolean" }).default(false),
  description: text("description"),
});

export const candidateEducation = sqliteTable("candidate_education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id").notNull().references(() => candidateProfiles.id),
  school: text("school").notNull(),
  degree: text("degree"),
  field: text("field"),
  yearCompleted: text("year_completed"),
});

export const candidateReferences = sqliteTable("candidate_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id").notNull().references(() => candidateProfiles.id),
  name: text("name").notNull(),
  relationship: text("relationship"),
  phone: text("phone"),
  email: text("email"),
});

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employerId: integer("employer_id").references(() => employerProfiles.id),
  org: text("org"),
  externalJobId: text("external_job_id").unique(),
  source: text("source").default("USAJobs"),
  title: text("title").notNull(),
  description: text("description"),
  city: text("city"),
  county: text("county"),
  state: text("state").notNull().default("WA"),
  location: text("location"),
  applyUrl: text("apply_url"),
  pay: text("pay"),
  category: text("category"),
  posted: text("posted"),
  employmentType: text("employment_type", {
    enum: ["full-time", "part-time"],
  }),
});

export const jobSkills = sqliteTable("job_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  skill: text("skill").notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  candidateProfile: one(candidateProfiles),
  employerProfile: one(employerProfiles),
}));

export const candidateRelations = relations(candidateProfiles, ({ one, many }) => ({
  user: one(users, { fields: [candidateProfiles.userId], references: [users.id] }),
  skills: many(candidateSkills),
  languages: many(candidateLanguages),
  experience: many(candidateExperience),
  education: many(candidateEducation),
  references: many(candidateReferences),
}));

export const employerRelations = relations(employerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [employerProfiles.userId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobRelations = relations(jobs, ({ one, many }) => ({
  employer: one(employerProfiles, {
    fields: [jobs.employerId],
    references: [employerProfiles.id],
  }),
  skills: many(jobSkills),
}));

export const candidateSkillRelations = relations(candidateSkills, ({ one }) => ({
  candidate: one(candidateProfiles, {
    fields: [candidateSkills.candidateId],
    references: [candidateProfiles.id],
  }),
}));

export const candidateLanguageRelations = relations(candidateLanguages, ({ one }) => ({
  candidate: one(candidateProfiles, {
    fields: [candidateLanguages.candidateId],
    references: [candidateProfiles.id],
  }),
}));

export const jobSkillRelations = relations(jobSkills, ({ one }) => ({
  job: one(jobs, {
    fields: [jobSkills.jobId],
    references: [jobs.id],
  }),
}));