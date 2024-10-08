/*
  Warnings:

  - You are about to alter the column `duration` on the `Prescription` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "duration" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "emergencyContactMobileNo" TEXT,
ALTER COLUMN "kebele" SET DATA TYPE TEXT;
