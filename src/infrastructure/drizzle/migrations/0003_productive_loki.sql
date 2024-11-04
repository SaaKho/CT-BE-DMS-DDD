ALTER TABLE "documents" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "author" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "author" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "tags" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "metadata" json DEFAULT '{}'::json;