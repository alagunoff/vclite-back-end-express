import { checkIfValueIsNotEmptyString } from "shared/validation/validators";

function validateLoginData(data: any) {
  const errors: { username?: string; password?: string } = {};

  if (Object.hasOwn(data, "username")) {
    if (!checkIfValueIsNotEmptyString(data.username)) {
      errors.username = "must be not empty string";
    }
  } else {
    errors.username = "required";
  }

  if (Object.hasOwn(data, "password")) {
    if (!checkIfValueIsNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateLoginData };
