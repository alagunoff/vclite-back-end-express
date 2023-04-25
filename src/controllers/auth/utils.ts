import { isNotEmptyString } from "shared/utils/validation";

import prisma from "prisma";

interface LoginRequestValidationErrors {
  username?: string;
  password?: string;
}

async function validateLoginRequestData(
  data: any
): Promise<LoginRequestValidationErrors | undefined> {
  const errors: LoginRequestValidationErrors = {};

  if ("username" in data) {
    if (isNotEmptyString(data.username)) {
      if (
        !(await prisma.user.findUnique({ where: { username: data.username } }))
      ) {
        errors.username = "user with this username wasn't found";
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

export { validateLoginRequestData };
