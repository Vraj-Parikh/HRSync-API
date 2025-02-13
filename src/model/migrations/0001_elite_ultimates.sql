ALTER TABLE "schedule" RENAME COLUMN "candidate_contact_no" TO "candidate_contact_num";--> statement-breakpoint
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_candidate_contact_no_unique";--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_candidate_contact_num_unique" UNIQUE("candidate_contact_num");