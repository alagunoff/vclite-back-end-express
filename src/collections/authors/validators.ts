import {
  checkIfValueIsNotEmptyString,
  checkIfValueIsPositiveInteger,
} from "shared/validation/validators";

function validateCreationData(data: any) {
  const errors: { description?: string; userId?: string } = {};

  if (
    Object.hasOwn(data, "description") &&
    !checkIfValueIsNotEmptyString(data.description)
  ) {
    errors.description = "must be not empty string";
  }

  if (Object.hasOwn(data, "userId")) {
    if (!checkIfValueIsPositiveInteger(data.userId)) {
      errors.userId = "must be positive integer";
    }
  } else {
    errors.userId = "required";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: { description?: string } = {};

  if (
    Object.hasOwn(data, "description") &&
    !checkIfValueIsNotEmptyString(data.description)
  ) {
    errors.description = "must be not empty string";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
