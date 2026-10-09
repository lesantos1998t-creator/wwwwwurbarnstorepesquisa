CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY,
	"product" text NOT NULL,
	"stars" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"age_range" text NOT NULL,
	"gender" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"house_number" text NOT NULL,
	"truthful_data" boolean NOT NULL,
	"voluntary_participation" boolean NOT NULL,
	"privacy_consent" boolean NOT NULL,
	"academic_use_consent" boolean NOT NULL,
	"consent_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
