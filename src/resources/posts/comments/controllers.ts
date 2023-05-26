import { type Request, type Response } from "express";

import validatePaginationQueryParameters from "src/shared/pagination/validator";
import { createPaginationParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData } from "./validators";
import { ApiError } from "src/shared/errors/classes";

async function createComment(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const commentCreationError = await services.createComment({
    ...req.body,
    postId: Number(req.params.postId),
  });

  if (commentCreationError) {
    res.status(commentCreationError.code).end();
    return;
  }

  res.status(201).end();
}

async function getComments(req: Request, res: Response) {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  const commentsGettingResult = await services.getPostComments(
    Number(req.params.postId),
    createPaginationParameters(req.query)
  );

  if (commentsGettingResult instanceof ApiError) {
    res.status(commentsGettingResult.code).end();
    return;
  }

  res.json(commentsGettingResult);
}

async function deleteComments(req: Request, res: Response) {
  const commentsDeletionError = await services.deletePostComments(
    Number(req.params.postId)
  );

  if (commentsDeletionError) {
    res.status(commentsDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createComment, getComments, deleteComments };
