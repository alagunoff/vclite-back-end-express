import { type Request, type Response } from "express";

import validatePaginationQueryParameters from "src/shared/pagination/validator";
import { createPaginationParameters } from "src/shared/pagination/utils";

import { validateCreationData, validateUpdateData } from "./validators";
import * as services from "./services";

async function createAuthor(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const authorCreationResult = await services.createAuthor(req.body);

  if (authorCreationResult.status === "failure") {
    res.status(authorCreationResult.errorCode).end();
    return;
  }

  res.status(201).end();
}

async function getAuthors(req: Request, res: Response) {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  res.json(await services.getAuthors(createPaginationParameters(req.query)));
}

async function updateAuthor(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const authorUpdateResult = await services.updateAuthorById(
    Number(req.params.id),
    req.body
  );

  if (authorUpdateResult.status === "failure") {
    res.status(authorUpdateResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

async function deleteAuthor(req: Request, res: Response) {
  const authorDeletionResult = await services.deleteAuthorById(
    Number(req.params.id)
  );

  if (authorDeletionResult.status === "failure") {
    res.status(authorDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
