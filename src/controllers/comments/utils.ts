import { isNotEmptyString } from "shared/utils/validation";

interface CreationDataValidationErrors {
  content?: string;
}

function validateCreationData(
  data: any
): CreationDataValidationErrors | undefined {
  const errors: CreationDataValidationErrors = {};

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData };
