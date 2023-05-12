import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import { validateCreationData, validateUpdateData } from "./validators";
import * as services from "./services";

function createAuthor(req: Request, res: Response): void {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createAuthor(
      validatedCreationData,
      () => {
        res.status(201).end();
      },
      () => {
        res.status(422).end();
      }
    );
  }
}

function getAuthors(req: Request, res: Response): void {
  const {
    validatedData: validatedPaginationQueryParameters,
    errors: paginationQueryParametersValidationErrors,
  } = validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
  } else {
    void services.getAuthors(
      validatedPaginationQueryParameters,
      (authors, authorsTotalNumber, pagesTotalNumber) => {
        res.json({ authors, authorsTotalNumber, pagesTotalNumber });
      }
    );
  }
}

function updateAuthor(req: Request, res: Response): void {
  const {
    validatedData: validatedUpdateData,
    errors: updateDataValidationErrors,
  } = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    void services.updateAuthorById(
      Number(req.params.id),
      validatedUpdateData,
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  }
}

function deleteAuthor(req: Request, res: Response): void {
  void services.deleteAuthorById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
