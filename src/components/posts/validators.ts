import { type Request } from "express";

import {
  isBase64ImageDataUrl,
  isNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  isDateString,
  isPositiveIntegersNotEmptyArray,
  isStringPositiveIntegersNotEmptyArray,
  isBase64ImageDataUrlsNotEmptyArray,
} from "src/shared/validation/utils";

import {
  type ValidatedCreationData,
  type ValidatedUpdateData,
  type ValidationErrors,
  type ValidatedFilterQueryParameters,
  type FilterQueryParametersValidationErrors,
  type ValidatedOrderQueryParameters,
  type OrderQueryParametersValidationErrors,
} from "./types";
import { ORDER_VALID_VALUES } from "./constants";

function validateCreationData(data: any):
  | {
      validatedData: ValidatedCreationData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
      errors.extraImages =
        "must be not empty array of base64 images in data URL formats with mediatypes";
    }
  }

  if ("title" in data) {
    if (!isNotEmptyString(data.title)) {
      errors.title = "must be not empty string";
    }
  } else {
    errors.title = "required";
  }

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  if ("categoryId" in data) {
    if (!isPositiveInteger(data.categoryId)) {
      errors.categoryId = "must be positive integer";
    }
  } else {
    errors.categoryId = "required";
  }

  if ("tagsIds" in data) {
    if (!isPositiveIntegersNotEmptyArray(data.tagsIds)) {
      errors.tagsIds = "must be not empty positive integers array";
    }
  } else {
    errors.tagsIds = "required";
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          image: data.image,
          extraImages: data.extraImages,
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          categoryId: data.categoryId,
          tagsIds: data.tagsIds,
        },
        errors: undefined,
      };
}

function validateFilterQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedFilterQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: FilterQueryParametersValidationErrors;
    } {
  const errors: FilterQueryParametersValidationErrors = {};

  if ("titleContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.titleContains)) {
      errors.titleContains = "must be not empty string";
    }
  }

  if ("contentContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.contentContains)) {
      errors.contentContains = "must be not empty string";
    }
  }

  if ("authorFirstName" in queryParameters) {
    if (!isNotEmptyString(queryParameters.authorFirstName)) {
      errors.authorFirstName = "must be not empty string";
    }
  }

  if ("categoryId" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.categoryId)) {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagId" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.tagId)) {
      errors.tagId = "must be positive integer";
    }
  }

  if ("tagIdIn" in queryParameters) {
    if (!isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdIn)) {
      errors.tagIdIn = "must be positive integers delimited by ampersand";
    }
  }

  if ("tagIdAll" in queryParameters) {
    if (!isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdAll)) {
      errors.tagIdAll = "must be positive integers delimited by ampersand";
    }
  }

  if ("createdAt" in queryParameters) {
    if (!isDateString(queryParameters.createdAt)) {
      errors.createdAt = "must be string representation of a date";
    }
  }

  if ("createdAtLt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtLt)) {
      errors.createdAtLt = "must be string representation of a date";
    }
  }

  if ("createdAtGt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtGt)) {
      errors.createdAtGt = "must be string representation of a date";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          titleContains: queryParameters.titleContains as string | undefined,
          contentContains: queryParameters.contentContains as
            | string
            | undefined,
          authorFirstName: queryParameters.authorFirstName as
            | string
            | undefined,
          categoryId: queryParameters.categoryId as string | undefined,
          tagId: queryParameters.tagId as string | undefined,
          tagIdIn: queryParameters.tagIdIn as string[] | undefined,
          tagIdAll: queryParameters.tagIdAll as string[] | undefined,
          createdAt: queryParameters.createdAt as string | undefined,
          createdAtLt: queryParameters.createdAtLt as string | undefined,
          createdAtGt: queryParameters.createdAtGt as string | undefined,
        },
        errors: undefined,
      };
}

function validateOrderQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedOrderQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: OrderQueryParametersValidationErrors;
    } {
  const errors: OrderQueryParametersValidationErrors = {};

  if ("orderBy" in queryParameters) {
    if (
      typeof queryParameters.orderBy !== "string" ||
      !ORDER_VALID_VALUES.includes(queryParameters.orderBy)
    ) {
      errors.orderBy = `must be one of the following strings [${String(
        ORDER_VALID_VALUES
      )}]`;
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          orderBy: queryParameters.orderBy as
            | (typeof ORDER_VALID_VALUES)[number]
            | undefined,
        },
        errors: undefined,
      };
}

function validateUpdateData(
  data: any,
  isPostBeingValidated: boolean = true
):
  | {
      validatedData: ValidatedUpdateData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
      errors.extraImages =
        "must be array of base64 images in data URL formats with mediatypes";
    }
  }

  if ("title" in data) {
    if (!isNotEmptyString(data.title)) {
      errors.title = "must be not empty string";
    }
  }

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  }

  if (isPostBeingValidated && "authorId" in data) {
    if (!isPositiveInteger(data.authorId)) {
      errors.authorId = "must be positive integer";
    }
  }

  if ("categoryId" in data) {
    if (!isPositiveInteger(data.categoryId)) {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagsIds" in data) {
    if (!isPositiveIntegersNotEmptyArray(data.tagsIds)) {
      errors.tagsIds = "must be not empty positive integers array";
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
          extraImages: data.extraImages,
          title: data.title,
          content: data.content,
          authorId: isPostBeingValidated ? data.authorId : undefined,
          categoryId: data.categoryId,
          tagsIds: data.tagsIds,
        },
        errors: undefined,
      };
}

export {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
};
