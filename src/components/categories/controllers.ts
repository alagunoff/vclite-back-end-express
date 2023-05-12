import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./validators";
import {
  CREATION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  DELETION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
} from "./constants";

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
        res
          .status(
            CREATION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE[failureReason]
          )
          .send(CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE[failureReason]);
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
        res
          .status(UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE[failureReason])
          .send(UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE[failureReason]);
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
      res
        .status(DELETION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE[failureReason])
        .send(DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE[failureReason]);
    }
  );
}

export { createCategory, getCategories, updateCategory, deleteCategory };
