import { type Request, type Response } from "express";

import prisma from "prisma";
import { validatePaginationQueryParameters } from "shared/pagination/utils";

import * as services from "./services";
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
      void services.createComment(
        postToCreateCommentFor.id,
        { content: req.body.content },
        () => {
          res.status(201).end();
        }
      );
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
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors,
    } = validatePaginationQueryParameters(req.query);

    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      void services.getComments(
        postToGetCommentsFor.id,
        validatedPaginationQueryParameters,
        (comments, commentsTotalNumber, pagesTotalNumber) => {
          res.json({ comments, commentsTotalNumber, pagesTotalNumber });
        }
      );
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
    void services.deleteComments(postToDeleteCommentsFrom.id, () => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
}

export { createComment, getComments, deleteComments };
