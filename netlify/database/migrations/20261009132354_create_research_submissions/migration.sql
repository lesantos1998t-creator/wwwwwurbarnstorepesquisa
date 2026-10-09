```sql
CREATE TABLE "feedback" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

--> statement-breakpoint

CREATE TABLE "ratings" (
    "id" SERIAL PRIMARY KEY,
    "product" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

--> statement-breakpoint

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
```
