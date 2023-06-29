import * as commentServices from "collections/comments/services";
import { ApiError } from "shared/errors/classes";
import { type PaginationParameters } from "shared/pagination/types";
import { prisma } from "shared/prisma";

async function createComment({
  content,
  postId,
}: {
  content: string;
  postId: number;
}) {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return new ApiError(404);
  }

  await commentServices.createComment({ content, postId });
}

async function getComments(
  postId: number,
  paginationParameters: PaginationParameters
) {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return new ApiError(404);
  }

  return await commentServices.getComments({ postId }, paginationParameters);
}

async function deleteComments(postId: number) {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return new ApiError(404);
  }

  await commentServices.deleteComments({ postId });
}

export { createComment, getComments, deleteComments };
