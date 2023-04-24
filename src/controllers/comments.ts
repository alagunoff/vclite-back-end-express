import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

async function createComment(req: Request, res: Response): Promise<void> {
  try {
    await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: Number(req.params.postId),
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getComments(req: Request, res: Response): Promise<void> {
  const errors = validatePaginationQueryParameters(req.query);

  if (errors) {
    res.status(400).json(errors);
  } else {
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(req.params.postId),
      },
      ...createPaginationParameters(req.query),
      select: {
        id: true,
        content: true,
      },
    });
    const commentsTotalNumber = await prisma.comment.count();

    res.json({
      comments,
      commentsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        commentsTotalNumber,
        comments.length
      ),
    });
  }
}

async function deleteComments(req: Request, res: Response): Promise<void> {
  try {
    await prisma.comment.deleteMany({
      where: {
        postId: Number(req.params.postId),
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

export { createComment, getComments, deleteComments };
