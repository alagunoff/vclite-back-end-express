import { type Request } from "express";

import { isStringPositiveInteger } from "shared/validation/utils";

import {
  type PaginationQueryParametersValidationErrors,
  type ValidatedPaginationQueryParameters,
} from "./types";

function validatePaginationQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedPaginationQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: PaginationQueryParametersValidationErrors;
    } {
  const validatedData: ValidatedPaginationQueryParameters = {};
  const errors: PaginationQueryParametersValidationErrors = {};

  if ("pageNumber" in queryParameters) {
    if (isStringPositiveInteger(queryParameters.pageNumber)) {
      validatedData.pageNumber = queryParameters.pageNumber;
    } else {
      errors.pageNumber = "must be positive integer";
    }

    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = "required";
    }
  }

  if ("itemsNumber" in queryParameters) {
    if (isStringPositiveInteger(queryParameters.itemsNumber)) {
      validatedData.itemsNumber = queryParameters.itemsNumber;
    } else {
      errors.itemsNumber = "must be positive integer";
    }

    if (!("pageNumber" in queryParameters)) {
      errors.pageNumber = "required";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData,
        errors: undefined,
      };
}

function createPaginationParameters({
  pageNumber,
  itemsNumber,
}: ValidatedPaginationQueryParameters):
  | {
      skip: number;
      take: number;
    }
  | undefined {
  if (typeof pageNumber === "string" && typeof itemsNumber === "string") {
    const itemsNumberAsNumber = Number(itemsNumber);

    return {
      skip: (Number(pageNumber) - 1) * itemsNumberAsNumber,
      take: itemsNumberAsNumber,
    };
  }
}

function calculatePagesTotalNumber(
  itemsTotalNumber: number,
  filteredItemsTotalNumber: number
): number {
  return itemsTotalNumber && filteredItemsTotalNumber
    ? Math.ceil(itemsTotalNumber / filteredItemsTotalNumber)
    : 1;
}

export {
  validatePaginationQueryParameters,
  createPaginationParameters,
  calculatePagesTotalNumber,
};
