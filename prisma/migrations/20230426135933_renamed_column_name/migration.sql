/*
  Warnings:

  - You are about to drop the column `image_url` on the `posts` table. All the data in the column will be lost.
  - Added the required column `image` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" RENAME COLUMN "image_url" TO "image";
