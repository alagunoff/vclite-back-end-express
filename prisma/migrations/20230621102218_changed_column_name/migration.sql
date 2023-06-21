/*
  Warnings:

  - You are about to drop the column `is_confirmed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_confirmed",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
