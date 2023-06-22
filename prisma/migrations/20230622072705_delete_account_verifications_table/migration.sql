/*
  Warnings:

  - You are about to drop the `account_verifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account_verifications" DROP CONSTRAINT "account_verifications_user_id_fkey";

-- DropTable
DROP TABLE "account_verifications";
