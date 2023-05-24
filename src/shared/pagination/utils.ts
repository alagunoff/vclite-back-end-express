import { type Request } from "express";

import { ERROR_MESSAGES } from "src/shared/validation/constants";
import { isStringPositiveInteger } from "src/shared/validation/validators";

import { type ValidationErrors, type PaginationParameters } from "./types";

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
}): PaginationParameters | undefined {
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
  itemsDesiredNumber?: number
): number {
  return itemsTotalNumber && itemsDesiredNumber
    ? Math.ceil(itemsTotalNumber / itemsDesiredNumber)
    : 1;
}

export {
  validatePaginationQueryParameters,
  createPaginationParameters,
  calculatePagesTotalNumber,
};
