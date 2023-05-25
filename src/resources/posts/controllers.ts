import { type Request, type Response } from "express";

import validatePaginationQueryParameters from "src/shared/pagination/validator";
import { createPaginationParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
} from "./validators";
import { createFilterParameters, createOrderParameters } from "./utils";

async function createPost(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const postCreationResult = await services.createPost({
    ...req.body,
    authorId: req.authenticatedAuthor?.id,
    isDraft: false,
  });

  if (postCreationResult.status === "failure") {
    res.status(postCreationResult.errorCode).send(postCreationResult.message);
    return;
  }

  res.status(201).end();
}

async function getPosts(req: Request, res: Response) {
  const filterQueryParametersValidationErrors = validateFilterQueryParameters(
    req.query
  );

  if (filterQueryParametersValidationErrors) {
    res.status(400).json(filterQueryParametersValidationErrors);
    return;
  }

  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  const orderQueryParametersValidationErrors = validateOrderQueryParameters(
    req.query
  );

  if (orderQueryParametersValidationErrors) {
    res.status(400).json(orderQueryParametersValidationErrors);
    return;
  }

  res.json(
    await services.getPosts(
      createFilterParameters(req.query),
      createPaginationParameters(req.query),
      createOrderParameters(req.query)
    )
  );
}

async function updatePost(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const postUpdateResult = await services.updatePost(
    { id: Number(req.params.id) },
    req.body
  );

  if (postUpdateResult.status === "failure") {
    res.status(postUpdateResult.errorCode);

    postUpdateResult.errorCode === 404
      ? res.end()
      : res.send(postUpdateResult.message);

    return;
  }

  res.status(204).end();
}

async function deletePost(req: Request, res: Response) {
  const postDeletionResult = await services.deletePost({
    id: Number(req.params.id),
  });

  if (postDeletionResult.status === "failure") {
    res.status(postDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createPost, getPosts, updatePost, deletePost };
