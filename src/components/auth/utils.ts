import { isNotEmptyString } from "shared/validation/utils";

import prisma from "prisma";

interface LoginDataValidationErrors {
  username?: string;
  password?: string;
}

async function validateLoginData(
  data: any
): Promise<LoginDataValidationErrors | undefined> {
  const errors: LoginDataValidationErrors = {};

  if ("username" in data) {
    if (isNotEmptyString(data.username)) {
      if (
        !(await prisma.user.findUnique({ where: { username: data.username } }))
      ) {
        errors.username = "user with this username doesn't exist";
      }
    } else {
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

export { validateLoginData };
