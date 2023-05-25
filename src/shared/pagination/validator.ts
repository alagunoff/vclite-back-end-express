import { type Request } from "express";

import { ERROR_MESSAGES } from "src/shared/validation/constants";
import { isStringPositiveInteger } from "src/shared/validation/validators";

export default function validatePaginationQueryParameters(
  queryParameters: Request["query"]
) {
  const errors: { pageNumber?: string; itemsNumber?: string } = {};

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
