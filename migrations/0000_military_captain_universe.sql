CREATE TABLE "parking_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"total_spots" integer NOT NULL,
	"available_spots" integer NOT NULL,
	"price_per_hour" numeric(5, 2) NOT NULL,
	"currency" text DEFAULT 'лв' NOT NULL,
	"type" text NOT NULL,
	"hours" text NOT NULL,
	"features" text[],
	"status" text NOT NULL,
	"district" text NOT NULL,
	"landmark" text,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
