import { isNotEmptyString } from "shared/validation/utils";

import prisma from "prisma";

import { type ValidatedLoginData, type ValidationErrors } from "./types";

async function validateLoginData(data: any): Promise<
  | {
      validatedData: ValidatedLoginData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    }
> {
  const errors: ValidationErrors = {};

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
