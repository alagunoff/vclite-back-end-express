import { type Request, type Response } from "express";

import { createPaginationParameters } from "shared/pagination/utils";
import validatePaginationQueryParameters from "shared/pagination/validator";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

async function createAuthor(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const authorCreationError = await services.createAuthor(req.body);

  if (authorCreationError) {
    res.status(authorCreationError.code).end();
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

  const authorUpdateError = await services.updateAuthorById(
    Number(req.params.id),
    req.body
  );

  if (authorUpdateError) {
    res.status(authorUpdateError.code).end();
    return;
  }

  res.status(204).end();
}

async function deleteAuthor(req: Request, res: Response) {
  const authorDeletionError = await services.deleteAuthorById(
    Number(req.params.id)
  );

  if (authorDeletionError) {
    res.status(authorDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
