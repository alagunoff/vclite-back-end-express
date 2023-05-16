import { Prisma, type Comment } from "@prisma/client";

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
  onFailure: (reason?: "postNotFound") => void
): Promise<void> {
  try {
    await prisma.post.update({
      where: { id: postId, isDraft: false },
      data: {
        comments: {
          create: { content },
        },
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("postNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
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
  onFailure: (reason?: "postNotFound") => void
): Promise<void> {
  const comments = await prisma.post
    .findUnique({
      where: {
        id: postId,
        isDraft: false,
      },
    })
    .comments({
      ...createPaginationParameters(validatedPaginationQueryParameters),
      select: {
        id: true,
        content: true,
      },
    });

  if (comments) {
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
  } else {
    onFailure("postNotFound");
  }
}

async function deletePostComments(
  postId: number,
  onSuccess: () => void,
  onFailure: (reason?: "postNotFound") => void
): Promise<void> {
  try {
    await prisma.post.update({
      where: { id: postId, isDraft: false },
      data: {
        comments: {
          deleteMany: {},
        },
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("postNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { createComment, getCommentsForPost, deletePostComments };
