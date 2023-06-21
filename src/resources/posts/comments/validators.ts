import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import { checkIfValueIsNotEmptyString } from "shared/validation/validators";

function validateCreationData(data: any) {
  const errors: {
    content?: string;
  } = {};

  if ("content" in data) {
    if (!checkIfValueIsNotEmptyString(data.content)) {
      errors.content = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.content = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData };
