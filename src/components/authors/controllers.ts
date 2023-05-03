import { type Request, type Response } from "express";

import prisma from "prisma";
import { validatePaginationQueryParameters } from "shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

async function createAuthor(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createAuthor(validatedCreationData, () => {
      res.status(201).end();
    });
  }
}

async function getAuthors(req: Request, res: Response): Promise<void> {
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

async function updateAuthor(req: Request, res: Response): Promise<void> {
  const authorToUpdate = await prisma.author.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (authorToUpdate) {
    const {
      validatedData: validatedUpdateData,
      errors: updateDataValidationErrors,
    } = validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updateAuthorById(
        authorToUpdate.id,
        validatedUpdateData,
        () => {
          res.status(204).end();
        }
      );
    }
  } else {
    res.status(404).end();
  }
}

async function deleteAuthor(req: Request, res: Response): Promise<void> {
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
