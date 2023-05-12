import { isNotEmptyString } from "src/shared/validation/utils";

import { type ValidatedLoginData, type ValidationErrors } from "./types";

function validateLoginData(data: any):
  | {
      validatedData: ValidatedLoginData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = "must be not empty string";
    }
  } else {
    errors.username = "required";
  }

  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          username: data.username,
          password: data.password,
        },
        errors: undefined,
      };
}

export { validateLoginData };
