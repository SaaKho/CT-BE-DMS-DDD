ALTER TABLE "documents" ADD COLUMN "fileName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "fileExtension" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "contentType" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "content";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "metadata";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "updated_at";