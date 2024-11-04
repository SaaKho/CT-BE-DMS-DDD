ALTER TABLE "permissions" DROP CONSTRAINT "permissions_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
