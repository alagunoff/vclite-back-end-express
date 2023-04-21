/*
  Warnings:

  - You are about to drop the column `parentCategoryId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `posts` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `posts` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "parentCategoryId",
ADD COLUMN     "parent_category_id" INTEGER;

-- AlterTable
ALTER TABLE "posts" RENAME COLUMN "imageUrl" TO "image_url";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
