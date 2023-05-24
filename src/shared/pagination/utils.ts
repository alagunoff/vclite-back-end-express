import { type Request } from "express";

import { ERROR_MESSAGES } from "src/shared/validation/constants";
import { isStringPositiveInteger } from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validatePaginationQueryParameters(
  queryParameters: Request["query"]
): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("pageNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.pageNumber)) {
      errors.pageNumber = ERROR_MESSAGES.positiveInteger;
    }

    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = ERROR_MESSAGES.required;
    }
  }

  if ("itemsNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.itemsNumber)) {
      errors.itemsNumber = ERROR_MESSAGES.positiveInteger;
    }

    if (!("pageNumber" in queryParameters)) {
      errors.pageNumber = ERROR_MESSAGES.required;
    }
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function createPaginationParameters({
  pageNumber,
  itemsNumber,
}: {
  pageNumber?: string;
  itemsNumber?: string;
}):
  | {
      skip: number;
      take: number;
    }
  | undefined {
  if (pageNumber && itemsNumber) {
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
