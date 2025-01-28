CREATE TABLE "candidate_details" (
	"candidate_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_no" varchar(255),
	"email" varchar(255),
	CONSTRAINT "candidate_details_contact_no_unique" UNIQUE("contact_no"),
	CONSTRAINT "candidate_details_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "hr_details" (
	"hr_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"contact_no" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "hr_details_contact_no_unique" UNIQUE("contact_no"),
	CONSTRAINT "hr_details_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "schedule" (
	"schedule_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"time_slot_id" uuid NOT NULL,
	"hr_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	CONSTRAINT "schedule_date_time_slot_id_hr_id_unique" UNIQUE("date","time_slot_id","hr_id")
);
--> statement-breakpoint
CREATE TABLE "time_slots" (
	"time_slot_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_time_slot_id_time_slots_time_slot_id_fk" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slots"("time_slot_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_hr_id_hr_details_hr_id_fk" FOREIGN KEY ("hr_id") REFERENCES "public"."hr_details"("hr_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_candidate_id_candidate_details_candidate_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidate_details"("candidate_id") ON DELETE no action ON UPDATE no action;