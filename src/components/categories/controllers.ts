import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";

function createCategory(req: Request, res: Response): void {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createCategory(
      validatedCreationData,
      () => {
        res.status(201).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "categoryAlreadyExists":
            res.status(422).send("category with this name already exists");
            break;
          case "parentCategoryNotFound":
            res.status(422).send("parent category with this id not found");
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

function getCategories(req: Request, res: Response): void {
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

function updateCategory(req: Request, res: Response): void {
  const {
    validatedData: validatedUpdateData,
    errors: updateDataValidationErrors,
  } = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    void services.updateCategoryById(
      Number(req.params.id),
      validatedUpdateData,
      () => {
        res.status(204).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "categoryNotFound":
            res.status(404).end();
            break;
          case "categoryAlreadyExists":
            res.status(422).send("category with this name already exists");
            break;
          case "parentCategoryNotFound":
            res.status(422).send("parent category with this id not found");
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

function deleteCategory(req: Request, res: Response): void {
  void services.deleteCategoryById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    (failureReason) => {
      switch (failureReason) {
        case "categoryNotFound":
          res.status(404).end();
          break;
        default:
          res.status(500).end();
      }
    }
  );
}

export { createCategory, getCategories, updateCategory, deleteCategory };
