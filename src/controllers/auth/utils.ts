import { isNotEmptyString } from "shared/utils/validation";

function validateRequestBody(data: any): Record<string, string> | undefined {
  const errors: Record<string, string> = {};

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

  return Object.keys(errors).length ? errors : undefined;
}

export { validateRequestBody };
