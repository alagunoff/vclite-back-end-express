import { type Comment } from "@prisma/client";

import prisma from "prisma";
import { type ValidatedPaginationQueryParameters } from "shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/pagination/utils";

import { type ValidatedCreationData } from "./types";

async function createComment(
  { content, postId }: ValidatedCreationData,
  onSuccess: () => void
): Promise<void> {
  await prisma.comment.create({ data: { content, postId } });

  onSuccess();
}

async function getCommentsByPostId(
  postId: number,
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    comments: Array<Omit<Comment, "postId">>,
    commentsTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    ...createPaginationParameters(validatedPaginationQueryParameters),
    select: {
      id: true,
      content: true,
    },
  });
  const commentsTotalNumber = await prisma.comment.count({
    where: {
      postId,
    },
  });

  onSuccess(
    comments,
    commentsTotalNumber,
    calculatePagesTotalNumber(commentsTotalNumber, comments.length)
  );
}

async function deleteCommentsByPostId(
  postId: number,
  onSuccess: () => void
): Promise<void> {
  await prisma.comment.deleteMany({ where: { postId } });

  onSuccess();
}

export { createComment, getCommentsByPostId, deleteCommentsByPostId };
