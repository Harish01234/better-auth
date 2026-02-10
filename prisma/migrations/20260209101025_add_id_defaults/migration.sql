-- AlterTable
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;
