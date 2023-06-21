import { checkIfValueIsNotEmptyString } from "shared/validation/validators";

function validateCreationData(data: any) {
  const errors: { content?: string } = {};

  if (Object.hasOwn(data, "content")) {
    if (!checkIfValueIsNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData };
