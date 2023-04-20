/*
  Warnings:

  - You are about to drop the `PostExtraImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostExtraImage" DROP CONSTRAINT "PostExtraImage_post_id_fkey";

-- DropTable
DROP TABLE "PostExtraImage";

-- CreateTable
CREATE TABLE "post_extra_images" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_extra_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_extra_images" ADD CONSTRAINT "post_extra_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
