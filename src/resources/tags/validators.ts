import { checkIfValueIsNotEmptyString } from "shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if (Object.hasOwn(data, "name")) {
    if (!checkIfValueIsNotEmptyString(data.name)) {
      errors.name = "must be not empty string";
    }
  } else {
    errors.name = "required";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if (Object.hasOwn(data, "name") && !checkIfValueIsNotEmptyString(data.name)) {
    errors.name = "must be not empty string";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
