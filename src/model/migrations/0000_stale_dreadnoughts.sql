CREATE TYPE "public"."interview_status" AS ENUM('PENDING', 'FINISHED', 'NO-SHOW', 'REJECTED', 'SELECTED', 'HOLD');--> statement-breakpoint
CREATE TABLE "hr_details" (
	"hr_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"contact_no" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "hr_details_contact_no_unique" UNIQUE("contact_no"),
	CONSTRAINT "hr_details_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "schedule" (
	"schedule_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_date_time" timestamp(0) with time zone NOT NULL,
	"end_date_time" timestamp(0) with time zone NOT NULL,
	"hr_id" uuid NOT NULL,
	"interview_status" "interview_status" DEFAULT 'PENDING' NOT NULL,
	"candidate_first_name" varchar(255) NOT NULL,
	"candidate_last_name" varchar(255) NOT NULL,
	"candidate_contact_num" varchar(255),
	"candidate_email" varchar(255),
	CONSTRAINT "schedule_candidate_contact_num_unique" UNIQUE("candidate_contact_num"),
	CONSTRAINT "schedule_candidate_email_unique" UNIQUE("candidate_email"),
	CONSTRAINT "schedule_hr_id_start_date_time_end_date_time_unique" UNIQUE("hr_id","start_date_time","end_date_time")
);
--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_hr_id_hr_details_hr_id_fk" FOREIGN KEY ("hr_id") REFERENCES "public"."hr_details"("hr_id") ON DELETE no action ON UPDATE no action;