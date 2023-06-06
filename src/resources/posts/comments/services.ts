import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import prisma from "shared/prisma";

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

  await prisma.comment.create({ data: { content, postId } });
}

async function getComments(
  filterParameters: Prisma.CommentWhereInput,
  paginationParameters: PaginationParameters
) {
  const comments = await prisma.comment.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: DEFAULT_ORDER_PARAMETERS,
    select: { id: true, content: true },
  });
  const commentsTotalNumber = await prisma.comment.count({
    where: filterParameters,
  });

  return {
    comments,
    commentsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      commentsTotalNumber,
      paginationParameters.take
    ),
  };
}

async function getPostComments(
  postId: number,
  paginationParameters: PaginationParameters
) {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return new ApiError(404);
  }

  return await getComments({ postId }, paginationParameters);
}

async function deleteComments(filterParameters: Prisma.CommentWhereInput) {
  await prisma.comment.deleteMany({ where: filterParameters });
}

async function deletePostComments(postId: number) {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return new ApiError(404);
  }

  await deleteComments({ postId });
}

export { createComment, getComments, getPostComments, deletePostComments };
