-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "fullName" TEXT,
    "profession" TEXT,
    "company" TEXT,
    "address" TEXT,
    "website" TEXT,
    "bio" VARCHAR(500),
    "avatar" TEXT
);

-- Remove profile fields from User if needed (manual step if you want to clean old columns)
