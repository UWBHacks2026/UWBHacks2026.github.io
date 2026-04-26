CREATE TABLE `candidate_education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`school` text NOT NULL,
	`degree` text,
	`field` text,
	`year_completed` text,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `candidate_experience` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`title` text NOT NULL,
	`employer` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`is_current` integer DEFAULT false,
	`description` text,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `candidate_references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`name` text NOT NULL,
	`relationship` text,
	`phone` text,
	`email` text,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employer_id` integer,
	`org` text,
	`external_job_id` text,
	`source` text DEFAULT 'USAJobs',
	`title` text NOT NULL,
	`description` text,
	`city` text,
	`county` text,
	`state` text DEFAULT 'WA' NOT NULL,
	`location` text,
	`apply_url` text,
	`pay` text,
	`category` text,
	`posted` text,
	`employment_type` text,
	FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_jobs`("id", "employer_id", "org", "external_job_id", "source", "title", "description", "city", "county", "state", "location", "apply_url", "pay", "category", "posted", "employment_type") SELECT "id", "employer_id", "org", "external_job_id", "source", "title", "description", "city", "county", "state", "location", "apply_url", "pay", "category", "posted", "employment_type" FROM `jobs`;--> statement-breakpoint
DROP TABLE `jobs`;--> statement-breakpoint
ALTER TABLE `__new_jobs` RENAME TO `jobs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_external_job_id_unique` ON `jobs` (`external_job_id`);