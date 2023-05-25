import { type Request, type Response } from "express";

import {
  validatePaginationQueryParameters,
  createPaginationParameters,
} from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

async function createCategory(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const categoryCreationResult = await services.createCategory(req.body);

  if (categoryCreationResult.status === "failure") {
    res
      .status(categoryCreationResult.errorCode)
      .send(categoryCreationResult.message);
    return;
  }

  res.status(201).end();
}

async function getCategories(req: Request, res: Response): Promise<void> {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  res.json(await services.getCategories(createPaginationParameters(req.query)));
}

async function updateCategory(req: Request, res: Response): Promise<void> {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const categoryUpdateResult = await services.updateCategoryById(
    Number(req.params.id),
    req.body
  );

  if (categoryUpdateResult.status === "failure") {
    res.status(categoryUpdateResult.errorCode);

    categoryUpdateResult.errorCode === 404
      ? res.end()
      : res.send(categoryUpdateResult.message);

    return;
  }

  res.status(204).end();
}

async function deleteCategory(req: Request, res: Response): Promise<void> {
  const categoryDeletionResult = await services.deleteCategoryById(
    Number(req.params.id)
  );

  if (categoryDeletionResult.status === "failure") {
    res.status(categoryDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createCategory, getCategories, updateCategory, deleteCategory };
