ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "VerificationCode" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_time" timestamp DEFAULT now();