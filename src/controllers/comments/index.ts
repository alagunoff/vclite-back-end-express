import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData } from "./utils";

async function createComment(req: Request, res: Response): Promise<void> {
  const postToCreateCommentFor = await prisma.post.findUnique({
    where: {
      id: Number(req.params.postId),
      isDraft: false,
    },
  });

  if (postToCreateCommentFor) {
    const creationDataValidationErrors = validateCreationData(req.body);

    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      await prisma.comment.create({
        data: {
          content: req.body.content,
          postId: postToCreateCommentFor.id,
        },
      });

      res.status(201).end();
    }
  } else {
    res.status(404).end();
  }
}

async function getComments(req: Request, res: Response): Promise<void> {
  const postToGetCommentsFor = await prisma.post.findUnique({
    where: {
      id: Number(req.params.postId),
      isDraft: false,
    },
  });

  if (postToGetCommentsFor) {
    const paginationQueryParametersValidationErrors =
      validatePaginationQueryParameters(req.query);

    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      const comments = await prisma.comment.findMany({
        where: {
          postId: postToGetCommentsFor.id,
        },
        ...createPaginationParameters(req.query),
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

      res.json({
        comments,
        commentsTotalNumber,
        pagesTotalNumber: calculatePagesTotalNumber(
          commentsTotalNumber,
          comments.length
        ),
      });
    }
  } else {
    res.status(404).end();
  }
}

async function deleteComments(req: Request, res: Response): Promise<void> {
  const postToDeleteCommentsFrom = await prisma.post.findUnique({
    where: {
      id: Number(req.params.postId),
      isDraft: false,
    },
  });

  if (postToDeleteCommentsFrom) {
    await prisma.comment.deleteMany({
      where: {
        postId: postToDeleteCommentsFrom.id,
      },
    });

    res.status(204).end();
  } else {
    res.status(404).end();
  }
}

export { createComment, getComments, deleteComments };
