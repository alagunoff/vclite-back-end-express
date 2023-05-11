import { type Request, type Response } from "express";

import prisma from "src/shared/prisma";
import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

async function createCategory(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createCategory(validatedCreationData, () => {
      res.status(201).end();
    });
  }
}

async function getCategories(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedPaginationQueryParameters,
    errors: paginationQueryParametersValidationErrors,
  } = validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
  } else {
    void services.getCategories(
      validatedPaginationQueryParameters,
      (categories, categoriesTotalNumber, pagesTotalNumber) => {
        res.json({ categories, categoriesTotalNumber, pagesTotalNumber });
      }
    );
  }
}

async function updateCategory(req: Request, res: Response): Promise<void> {
  const categoryToUpdate = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (categoryToUpdate) {
    const {
      validatedData: validatedUpdateData,
      errors: updateDataValidationErrors,
    } = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updateCategoryById(
        categoryToUpdate.id,
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

async function deleteCategory(req: Request, res: Response): Promise<void> {
  void services.deleteCategoryById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createCategory, getCategories, updateCategory, deleteCategory };
