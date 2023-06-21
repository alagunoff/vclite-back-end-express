import { type Request } from "express";

import { checkIfValueIsStringPositiveInteger } from "shared/validation/validators";

export default function validatePaginationQueryParameters(
  queryParameters: Request["query"]
) {
  const errors: { pageNumber?: string; itemsNumber?: string } = {};

  if (Object.hasOwn(queryParameters, "pageNumber")) {
    if (!checkIfValueIsStringPositiveInteger(queryParameters.pageNumber)) {
      errors.pageNumber = "must be positive integer";
    }

    if (!Object.hasOwn(queryParameters, "itemsNumber")) {
      errors.itemsNumber = "required";
    }
  }

  if (Object.hasOwn(queryParameters, "itemsNumber")) {
    if (!checkIfValueIsStringPositiveInteger(queryParameters.itemsNumber)) {
      errors.itemsNumber = "must be positive integer";
    }

    if (!Object.hasOwn(queryParameters, "pageNumber")) {
      errors.pageNumber = "required";
    }
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}
