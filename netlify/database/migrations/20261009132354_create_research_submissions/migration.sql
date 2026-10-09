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

CREATE TABLE "registrations" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "truthful_data" BOOLEAN NOT NULL DEFAULT FALSE,
    "voluntary_participation" BOOLEAN NOT NULL DEFAULT FALSE,
    "privacy_consent" BOOLEAN NOT NULL DEFAULT FALSE,
    "academic_use_consent" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
