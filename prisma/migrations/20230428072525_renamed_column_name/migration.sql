/*
  Warnings:

  - You are about to drop the column `url` on the `post_extra_images` table. All the data in the column will be lost.
  - Added the required column `image` to the `post_extra_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_extra_images" RENAME COLUMN "url" to "image";
