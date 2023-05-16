import { type Comment } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData } from "./types";

async function createComment(
  { content, postId }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  const postToCreateCommentFor = await prisma.post.findUnique({
    where: {
      id: postId,
      isDraft: false,
    },
  });

  if (postToCreateCommentFor) {
    await prisma.comment.create({
      data: { content, postId: postToCreateCommentFor.id },
    });

    onSuccess();
  } else {
    onFailure();
  }
}

async function getCommentsForPost(
  postId: number,
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    comments: Array<Omit<Comment, "postId">>,
    commentsTotalNumber: number,
    pagesTotalNumber: number
  ) => void,
  onFailure: () => void
): Promise<void> {
  const postToGetCommentsFor = await prisma.post.findUnique({
    where: {
      id: postId,
      isDraft: false,
    },
  });

  if (postToGetCommentsFor) {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postToGetCommentsFor.id,
      },
      ...createPaginationParameters(validatedPaginationQueryParameters),
      select: {
        id: true,
        content: true,
      },
    });
    const commentsTotalNumber = await prisma.comment.count({
      where: {
        postId: postToGetCommentsFor.id,
      },
    });

    onSuccess(
      comments,
      commentsTotalNumber,
      calculatePagesTotalNumber(commentsTotalNumber, comments.length)
    );
  } else {
    onFailure();
  }
}

async function deletePostComments(
  postId: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  const postToDeleteCommentsFrom = await prisma.post.findUnique({
    where: {
      id: postId,
      isDraft: false,
    },
  });

  if (postToDeleteCommentsFrom) {
    await prisma.comment.deleteMany({
      where: { postId: postToDeleteCommentsFrom.id },
    });

    onSuccess();
  } else {
    onFailure();
  }
}

export { createComment, getCommentsForPost, deletePostComments };
