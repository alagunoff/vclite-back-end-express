import { type Request } from "express";

import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import { isStringPositiveInteger } from "shared/validation/validators";

export default function validatePaginationQueryParameters(
  queryParameters: Request["query"]
) {
  const errors: { pageNumber?: string; itemsNumber?: string } = {};

  if ("pageNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.pageNumber)) {
      errors.pageNumber = VALIDATION_ERROR_MESSAGES.positiveInteger;
    }

    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = VALIDATION_ERROR_MESSAGES.required;
    }
  }

  if ("itemsNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.itemsNumber)) {
      errors.itemsNumber = VALIDATION_ERROR_MESSAGES.positiveInteger;
    }

    if (!("pageNumber" in queryParameters)) {
      errors.pageNumber = VALIDATION_ERROR_MESSAGES.required;
    }
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}
