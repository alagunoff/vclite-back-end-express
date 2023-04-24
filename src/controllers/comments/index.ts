import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData } from "./utils";

async function createComment(req: Request, res: Response): Promise<void> {
  const errors = await validateCreationData({
    ...req.body,
    postId: Number(req.params.postId),
  });

  if (errors) {
    res.status(400).json(errors);
  } else {
    await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: Number(req.params.postId),
      },
    });

    res.status(201).end();
  }
}

async function getComments(req: Request, res: Response): Promise<void> {
  const postToGetCommentsFor = await prisma.post.findUnique({
    where: {
      id: Number(req.params.postId),
    },
  });

  if (postToGetCommentsFor) {
    const errors = validatePaginationQueryParameters(req.query);

    if (errors) {
      res.status(400).json(errors);
    } else {
      const comments = await prisma.comment.findMany({
        where: {
          postId: postToGetCommentsFor?.id,
        },
        ...createPaginationParameters(req.query),
        select: {
          id: true,
          content: true,
        },
      });
      const commentsTotalNumber = await prisma.comment.count({
        where: {
          postId: postToGetCommentsFor?.id,
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
    res.status(404).send("Post with this id wasn't found");
  }
}

async function deleteComments(req: Request, res: Response): Promise<void> {
  const postToDeleteCommentsFrom = await prisma.post.findUnique({
    where: {
      id: Number(req.params.postId),
    },
  });

  if (postToDeleteCommentsFrom) {
    await prisma.comment.deleteMany({
      where: {
        postId: Number(req.params.postId),
      },
    });

    res.status(204).end();
  } else {
    res.status(404).send("Post with this id wasn't found");
  }
}

export { createComment, getComments, deleteComments };
