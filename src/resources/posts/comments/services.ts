import { type Prisma } from "@prisma/client";

import prisma from "src/shared/prisma/client";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";

async function createComment({
  content,
  postId,
}: {
  content: string;
  postId: number;
}): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return { status: "failure", errorCode: 404 };
  }

  await prisma.comment.create({ data: { content, postId } });

  return { status: "success" };
}

async function getComments(
  filterParameters: Prisma.CommentWhereInput,
  paginationParameters: PaginationParameters
) {
  const comments = await prisma.comment.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      content: true,
    },
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
): Promise<
  | { status: "success"; data: Awaited<ReturnType<typeof getComments>> }
  | { status: "failure"; errorCode: 404 }
> {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return { status: "failure", errorCode: 404 };
  }

  return {
    status: "success",
    data: await getComments({ postId }, paginationParameters),
  };
}

async function deleteComments(filterParameters: Prisma.CommentWhereInput) {
  await prisma.comment.deleteMany({ where: filterParameters });
}

async function deletePostComments(
  postId: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (
    !(await prisma.post.findUnique({ where: { id: postId, isDraft: false } }))
  ) {
    return { status: "failure", errorCode: 404 };
  }

  await deleteComments({ postId });

  return { status: "success" };
}

export { createComment, getComments, getPostComments, deletePostComments };
