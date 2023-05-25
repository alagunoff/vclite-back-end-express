import { ERROR_MESSAGES } from "src/shared/validation/constants";
import { isNotEmptyString } from "src/shared/validation/validators";

function validateCreationData(data: any) {
  const errors: {
    content?: string;
  } = {};

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.content = ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData };
