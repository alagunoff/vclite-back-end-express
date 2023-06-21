import { type Request } from "express";

import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import {
  checkIfValueIsBase64WebpImageDataUrl,
  checkIfValueIsNotEmptyString,
  checkIfValueIsPositiveInteger,
  checkIfValueIsStringPositiveInteger,
  checkIfValueIsDateString,
  checkIfValueIsPositiveIntegers,
  checkIfValueIsStringPositiveIntegers,
  checkIfValueIsBase64WebpImageDataUrls,
} from "shared/validation/validators";

import { VALID_ORDER_OPTIONS } from "./constants";
import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!checkIfValueIsBase64WebpImageDataUrl(data.image)) {
      errors.image = VALIDATION_ERROR_MESSAGES.base64WebpImageDataUrl;
    }
  } else {
    errors.image = VALIDATION_ERROR_MESSAGES.required;
  }

  if (
    "extraImages" in data &&
    !checkIfValueIsBase64WebpImageDataUrls(data.extraImages)
  ) {
    errors.extraImages = VALIDATION_ERROR_MESSAGES.base64WebpImageDataUrls;
  }

  if ("title" in data) {
    if (!checkIfValueIsNotEmptyString(data.title)) {
      errors.title = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.title = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("content" in data) {
    if (!checkIfValueIsNotEmptyString(data.content)) {
      errors.content = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.content = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("categoryId" in data) {
    if (!checkIfValueIsPositiveInteger(data.categoryId)) {
      errors.categoryId = VALIDATION_ERROR_MESSAGES.positiveInteger;
    }
  } else {
    errors.categoryId = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("tagsIds" in data) {
    if (!checkIfValueIsPositiveIntegers(data.tagsIds)) {
      errors.tagsIds = VALIDATION_ERROR_MESSAGES.positiveIntegersArray;
    }
  } else {
    errors.tagsIds = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length !== 0) {
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
    !checkIfValueIsNotEmptyString(queryParameters.titleContains)
  ) {
    errors.titleContains = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (
    "contentContains" in queryParameters &&
    !checkIfValueIsNotEmptyString(queryParameters.contentContains)
  ) {
    errors.contentContains = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (
    "authorFirstName" in queryParameters &&
    !checkIfValueIsNotEmptyString(queryParameters.authorFirstName)
  ) {
    errors.authorFirstName = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (
    "categoryId" in queryParameters &&
    !checkIfValueIsStringPositiveInteger(queryParameters.categoryId)
  ) {
    errors.categoryId = VALIDATION_ERROR_MESSAGES.positiveInteger;
  }

  if (
    "tagId" in queryParameters &&
    !checkIfValueIsStringPositiveInteger(queryParameters.tagId)
  ) {
    errors.tagId = VALIDATION_ERROR_MESSAGES.positiveInteger;
  }

  if (
    "tagIdIn" in queryParameters &&
    !checkIfValueIsStringPositiveIntegers(queryParameters.tagIdIn)
  ) {
    errors.tagIdIn = "must be positive integers delimited by ampersand";
  }

  if (
    "tagIdAll" in queryParameters &&
    !checkIfValueIsStringPositiveIntegers(queryParameters.tagIdAll)
  ) {
    errors.tagIdAll = "must be positive integers delimited by ampersand";
  }

  if (
    "createdAt" in queryParameters &&
    !checkIfValueIsDateString(queryParameters.createdAt)
  ) {
    errors.createdAt = VALIDATION_ERROR_MESSAGES.dateString;
  }

  if (
    "createdAtLt" in queryParameters &&
    !checkIfValueIsDateString(queryParameters.createdAtLt)
  ) {
    errors.createdAtLt = VALIDATION_ERROR_MESSAGES.dateString;
  }

  if (
    "createdAtGt" in queryParameters &&
    !checkIfValueIsDateString(queryParameters.createdAtGt)
  ) {
    errors.createdAtGt = VALIDATION_ERROR_MESSAGES.dateString;
  }

  if (Object.keys(errors).length !== 0) {
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

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if ("image" in data && !checkIfValueIsBase64WebpImageDataUrl(data.image)) {
    errors.image = VALIDATION_ERROR_MESSAGES.base64WebpImageDataUrl;
  }

  if (
    "extraImages" in data &&
    !checkIfValueIsBase64WebpImageDataUrls(data.extraImages)
  ) {
    errors.extraImages = VALIDATION_ERROR_MESSAGES.base64WebpImageDataUrls;
  }

  if ("title" in data && !checkIfValueIsNotEmptyString(data.title)) {
    errors.title = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if ("content" in data && !checkIfValueIsNotEmptyString(data.content)) {
    errors.content = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if ("categoryId" in data && !checkIfValueIsPositiveInteger(data.categoryId)) {
    errors.categoryId = VALIDATION_ERROR_MESSAGES.positiveInteger;
  }

  if ("tagsIds" in data && !checkIfValueIsPositiveIntegers(data.tagsIds)) {
    errors.tagsIds = VALIDATION_ERROR_MESSAGES.positiveIntegersArray;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
};
