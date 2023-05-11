import { type Request } from "express";

import { isStringPositiveInteger } from "src/shared/validation/utils";

import {
  type ValidatedPaginationQueryParameters,
  type ValidationErrors,
} from "./types";

function validatePaginationQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedPaginationQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("pageNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.pageNumber)) {
      errors.pageNumber = "must be positive integer";
    }

    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = "required";
    }
  }

  if ("itemsNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.itemsNumber)) {
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
        validatedData: {
          pageNumber: queryParameters.pageNumber as string | undefined,
          itemsNumber: queryParameters.itemsNumber as string | undefined,
        },
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
