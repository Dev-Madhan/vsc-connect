/*
  Warnings:

  - A unique constraint covering the columns `[vmNumber]` on the table `Member` will be added.
  - Added the required columns `department` and `vmNumber` to the `Member` table.

  NOTE: Columns are added with a temporary default so existing rows are handled,
  then the default is removed to enforce NOT NULL without a static default.
*/

-- AlterTable: add with temporary defaults so existing rows are satisfied
ALTER TABLE "Member"
  ADD COLUMN "department" TEXT NOT NULL DEFAULT 'Unknown',
  ADD COLUMN "vmNumber"   TEXT NOT NULL DEFAULT 'VM-LEGACY-' || gen_random_uuid()::text;

-- Back-fill vmNumber for any existing rows to ensure uniqueness
UPDATE "Member"
SET "vmNumber" = 'VM-LEGACY-' || id
WHERE "vmNumber" LIKE 'VM-LEGACY-%';

-- Drop the defaults — new inserts must supply values explicitly
ALTER TABLE "Member" ALTER COLUMN "department" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "vmNumber"   DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Member_vmNumber_key" ON "Member"("vmNumber");
