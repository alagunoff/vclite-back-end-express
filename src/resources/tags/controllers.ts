import { type Request, type Response } from "express";

import validatePaginationQueryParameters from "src/shared/pagination/validator";
import { createPaginationParameters } from "src/shared/pagination/utils";

import { validateCreationData, validateUpdateData } from "./validators";
import * as services from "./services";

async function createTag(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const tagCreationResult = await services.createTag(req.body);

  if (tagCreationResult.status === "failure") {
    res.status(tagCreationResult.errorCode).end();
    return;
  }

  res.status(201).end();
}

async function getTags(req: Request, res: Response) {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  res.json(await services.getTags(createPaginationParameters(req.query)));
}

async function updateTag(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const tagUpdateResult = await services.updateTagById(
    Number(req.params.id),
    req.body
  );

  if (tagUpdateResult.status === "failure") {
    res.status(tagUpdateResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

async function deleteTag(req: Request, res: Response) {
  const tagDeletionResult = await services.deleteTagById(Number(req.params.id));

  if (tagDeletionResult.status === "failure") {
    res.status(tagDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createTag, getTags, updateTag, deleteTag };
