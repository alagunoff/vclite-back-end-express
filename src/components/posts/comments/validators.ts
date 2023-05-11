import { isNotEmptyString } from "src/shared/validation/utils";

import { type ValidatedCreationData, type ValidationErrors } from "./types";

function validateCreationData(data: any):
  | {
      validatedData: ValidatedCreationData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          content: data.content,
          postId: data.postId,
        },
        errors: undefined,
      };
}

export { validateCreationData };
