ALTER TABLE "users" ADD COLUMN "verification_code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "VerificationCode";