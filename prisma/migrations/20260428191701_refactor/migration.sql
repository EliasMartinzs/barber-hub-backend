/*
  Warnings:

  - The values [STAFF] on the enum `MembershipRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - Added the required column `durationInMinutes` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MembershipRole_new" AS ENUM ('OWNER', 'BARBER');
ALTER TABLE "Membership" ALTER COLUMN "role" TYPE "MembershipRole_new" USING ("role"::text::"MembershipRole_new");
ALTER TYPE "MembershipRole" RENAME TO "MembershipRole_old";
ALTER TYPE "MembershipRole_new" RENAME TO "MembershipRole";
DROP TYPE "public"."MembershipRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "duration",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
