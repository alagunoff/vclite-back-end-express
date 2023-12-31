import { type Request, type Response } from "express";

import { createPaginationParameters } from "shared/pagination/utils";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

import * as services from "./services";
import { createFilterParameters, createOrderParameters } from "./utils";
import {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
} from "./validators";

async function createPost(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const postCreationError = await services.createPost({
    image: req.body.image,
    extraImages: req.body.extraImages,
    title: req.body.title,
    content: req.body.content,
    authorId: req.authenticatedAuthor?.id as number,
    categoryId: req.body.categoryId,
    tagIds: req.body.tagIds,
    isDraft: false,
  });

  if (postCreationError) {
    res.status(postCreationError.code).send(postCreationError.reason);
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
    await services.getPosts({
      where: createFilterParameters(req.query),
      ...createPaginationParameters(req.query),
      orderBy: createOrderParameters(req.query),
    })
  );
}

async function updatePost(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const postUpdateError = await services.updatePost(
    { id: Number(req.params.id) },
    {
      image: req.body.image,
      extraImages: req.body.extraImages,
      title: req.body.title,
      content: req.body.content,
      categoryId: req.body.categoryId,
      tagIds: req.body.tagIds,
    }
  );

  if (postUpdateError) {
    res.status(postUpdateError.code);

    postUpdateError.reason ? res.send(postUpdateError.reason) : res.end();

    return;
  }

  res.status(204).end();
}

async function deletePost(req: Request, res: Response) {
  const postDeletionError = await services.deletePost({
    id: Number(req.params.id),
  });

  if (postDeletionError) {
    res.status(postDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createPost, getPosts, updatePost, deletePost };
