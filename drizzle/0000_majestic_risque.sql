CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"snippet_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"platform_fee" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"download_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"language" text NOT NULL,
	"price" integer NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer,
	"preview_image" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"stripe_account_id" text,
	"stripe_account_status" text DEFAULT 'inactive' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;