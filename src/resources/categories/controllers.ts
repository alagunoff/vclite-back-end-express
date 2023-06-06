import { type Request, type Response } from "express";

import { createPaginationParameters } from "shared/pagination/utils";
import validatePaginationQueryParameters from "shared/pagination/validator";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

async function createCategory(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const categoryCreationError = await services.createCategory(req.body);

  if (categoryCreationError) {
    res.status(categoryCreationError.code).send(categoryCreationError.reason);
    return;
  }

  res.status(201).end();
}

async function getCategories(req: Request, res: Response) {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  res.json(await services.getCategories(createPaginationParameters(req.query)));
}

async function updateCategory(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const categoryUpdateError = await services.updateCategoryById(
    Number(req.params.id),
    req.body
  );

  if (categoryUpdateError) {
    res.status(categoryUpdateError.code);

    categoryUpdateError.reason
      ? res.send(categoryUpdateError.reason)
      : res.end();

    return;
  }

  res.status(204).end();
}

async function deleteCategory(req: Request, res: Response) {
  const categoryDeletionError = await services.deleteCategoryById(
    Number(req.params.id)
  );

  if (categoryDeletionError) {
    res.status(categoryDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createCategory, getCategories, updateCategory, deleteCategory };
