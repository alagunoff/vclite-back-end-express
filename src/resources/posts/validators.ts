import { type Request } from "express";

import { ERROR_MESSAGES } from "src/shared/validation/constants";
import {
  isBase64ImageDataUrl,
  isNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  isDateString,
  isPositiveIntegersArray,
  isStringPositiveIntegersArray,
  isBase64ImageDataUrlsArray,
} from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";
import { VALID_ORDER_OPTIONS } from "./constants";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = ERROR_MESSAGES.base64ImageDataUrl;
    }
  } else {
    errors.image = ERROR_MESSAGES.required;
  }

  if ("extraImages" in data && !isBase64ImageDataUrlsArray(data.extraImages)) {
    errors.extraImages = ERROR_MESSAGES.base64ImageDataUrlsArray;
  }

  if ("title" in data) {
    if (!isNotEmptyString(data.title)) {
      errors.title = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.title = ERROR_MESSAGES.required;
  }

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.content = ERROR_MESSAGES.required;
  }

  if ("categoryId" in data) {
    if (!isPositiveInteger(data.categoryId)) {
      errors.categoryId = ERROR_MESSAGES.positiveInteger;
    }
  } else {
    errors.categoryId = ERROR_MESSAGES.required;
  }

  if ("tagsIds" in data) {
    if (!isPositiveIntegersArray(data.tagsIds)) {
      errors.tagsIds = ERROR_MESSAGES.positiveIntegersArray;
    }
  } else {
    errors.tagsIds = ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateFilterQueryParameters(queryParameters: Request["query"]) {
  const errors: {
    titleContains?: string;
    contentContains?: string;
    authorFirstName?: string;
    categoryId?: string;
    tagId?: string;
    tagIdIn?: string;
    tagIdAll?: string;
    createdAt?: string;
    createdAtLt?: string;
    createdAtGt?: string;
  } = {};

  if (
    "titleContains" in queryParameters &&
    !isNotEmptyString(queryParameters.titleContains)
  ) {
    errors.titleContains = ERROR_MESSAGES.notEmptyString;
  }

  if (
    "contentContains" in queryParameters &&
    !isNotEmptyString(queryParameters.contentContains)
  ) {
    errors.contentContains = ERROR_MESSAGES.notEmptyString;
  }

  if (
    "authorFirstName" in queryParameters &&
    !isNotEmptyString(queryParameters.authorFirstName)
  ) {
    errors.authorFirstName = ERROR_MESSAGES.notEmptyString;
  }

  if (
    "categoryId" in queryParameters &&
    !isStringPositiveInteger(queryParameters.categoryId)
  ) {
    errors.categoryId = ERROR_MESSAGES.positiveInteger;
  }

  if (
    "tagId" in queryParameters &&
    !isStringPositiveInteger(queryParameters.tagId)
  ) {
    errors.tagId = ERROR_MESSAGES.positiveInteger;
  }

  if (
    "tagIdIn" in queryParameters &&
    !isStringPositiveIntegersArray(queryParameters.tagIdIn)
  ) {
    errors.tagIdIn = "must be positive integers delimited by ampersand";
  }

  if (
    "tagIdAll" in queryParameters &&
    !isStringPositiveIntegersArray(queryParameters.tagIdAll)
  ) {
    errors.tagIdAll = "must be positive integers delimited by ampersand";
  }

  if (
    "createdAt" in queryParameters &&
    !isDateString(queryParameters.createdAt)
  ) {
    errors.createdAt = ERROR_MESSAGES.date;
  }

  if (
    "createdAtLt" in queryParameters &&
    !isDateString(queryParameters.createdAtLt)
  ) {
    errors.createdAtLt = ERROR_MESSAGES.date;
  }

  if (
    "createdAtGt" in queryParameters &&
    !isDateString(queryParameters.createdAtGt)
  ) {
    errors.createdAtGt = ERROR_MESSAGES.date;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateOrderQueryParameters(queryParameters: Request["query"]) {
  const errors: {
    orderBy?: string;
  } = {};

  if (
    "orderBy" in queryParameters &&
    (typeof queryParameters.orderBy !== "string" ||
      !VALID_ORDER_OPTIONS.includes(queryParameters.orderBy as any))
  ) {
    errors.orderBy = `must be one of the following options [${String(
      VALID_ORDER_OPTIONS
    )}]`;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if ("image" in data && !isBase64ImageDataUrl(data.image)) {
    errors.image = ERROR_MESSAGES.base64ImageDataUrl;
  }

  if ("extraImages" in data && !isBase64ImageDataUrlsArray(data.extraImages)) {
    errors.extraImages = ERROR_MESSAGES.base64ImageDataUrlsArray;
  }

  if ("title" in data && !isNotEmptyString(data.title)) {
    errors.title = ERROR_MESSAGES.notEmptyString;
  }

  if ("content" in data && !isNotEmptyString(data.content)) {
    errors.content = ERROR_MESSAGES.notEmptyString;
  }

  if ("categoryId" in data && !isPositiveInteger(data.categoryId)) {
    errors.categoryId = ERROR_MESSAGES.positiveInteger;
  }

  if ("tagsIds" in data && !isPositiveIntegersArray(data.tagsIds)) {
    errors.tagsIds = ERROR_MESSAGES.positiveIntegersArray;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
};
