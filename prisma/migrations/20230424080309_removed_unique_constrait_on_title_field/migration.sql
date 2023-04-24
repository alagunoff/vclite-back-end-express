/*
  Warnings:

  - A unique constraint covering the columns `[id,is_draft,author_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "posts_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "posts_id_is_draft_author_id_key" ON "posts"("id", "is_draft", "author_id");
