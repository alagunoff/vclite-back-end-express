import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";

async function createComment(req: Request, res: Response): Promise<void> {
  try {
    await prisma.comment.create({
      data: {
        comment: req.body.comment,
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
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(req.params.postId),
      },
      skip,
      take,
      select: {
        id: true,
        comment: true,
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
  } catch (error) {
    console.log(error);

    res.status(500).end();
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
