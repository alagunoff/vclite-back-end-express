import prisma from "shared/prisma";
import {
  isNotEmptyString,
  isBase64ImageDataUrl,
} from "shared/validation/utils";

import { type ValidatedCreationData, type ValidationErrors } from "./types";

async function validateCreationData(data: any): Promise<
  | {
      validatedData: ValidatedCreationData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    }
> {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }

  if ("username" in data) {
    if (isNotEmptyString(data.username)) {
      if (
        await prisma.user.findUnique({ where: { username: data.username } })
      ) {
        errors.username = "user with the same username already exists";
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

  if ("firstName" in data) {
    if (!isNotEmptyString(data.firstName)) {
      errors.firstName = "must be not empty string";
    }
  }

  if ("lastName" in data) {
    if (!isNotEmptyString(data.lastName)) {
      errors.lastName = "must be not empty string";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          image: data.image,
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        errors: undefined,
      };
}

export { validateCreationData };
