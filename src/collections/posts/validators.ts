import { type Request } from "express";

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

  if (Object.hasOwn(data, "image")) {
    if (!checkIfValueIsBase64WebpImageDataUrl(data.image)) {
      errors.image =
        'must be base64 image in data URL format with "image/webp" mediatype';
    }
  } else {
    errors.image = "required";
  }

  if (
    Object.hasOwn(data, "extraImages") &&
    !checkIfValueIsBase64WebpImageDataUrls(data.extraImages)
  ) {
    errors.extraImages =
      'must be array of base64 images in data URL format with "image/webp" mediatype';
  }

  if (Object.hasOwn(data, "title")) {
    if (!checkIfValueIsNotEmptyString(data.title)) {
      errors.title = "must be not empty string";
    }
  } else {
    errors.title = "required";
  }

  if (Object.hasOwn(data, "content")) {
    if (!checkIfValueIsNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  if (Object.hasOwn(data, "categoryId")) {
    if (!checkIfValueIsPositiveInteger(data.categoryId)) {
      errors.categoryId = "must be positive integer";
    }
  } else {
    errors.categoryId = "required";
  }

  if (Object.hasOwn(data, "tagIds")) {
    if (!checkIfValueIsPositiveIntegers(data.tagIds)) {
      errors.tagIds = "must be array of positive integers";
    }
  } else {
    errors.tagIds = "required";
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
    Object.hasOwn(queryParameters, "titleContains") &&
    !checkIfValueIsNotEmptyString(queryParameters.titleContains)
  ) {
    errors.titleContains = "must be not empty string";
  }

  if (
    Object.hasOwn(queryParameters, "contentContains") &&
    !checkIfValueIsNotEmptyString(queryParameters.contentContains)
  ) {
    errors.contentContains = "must be not empty string";
  }

  if (
    Object.hasOwn(queryParameters, "authorFirstName") &&
    !checkIfValueIsNotEmptyString(queryParameters.authorFirstName)
  ) {
    errors.authorFirstName = "must be not empty string";
  }

  if (
    Object.hasOwn(queryParameters, "categoryId") &&
    !checkIfValueIsStringPositiveInteger(queryParameters.categoryId)
  ) {
    errors.categoryId = "must be positive integer";
  }

  if (
    Object.hasOwn(queryParameters, "tagId") &&
    !checkIfValueIsStringPositiveInteger(queryParameters.tagId)
  ) {
    errors.tagId = "must be positive integer";
  }

  if (
    Object.hasOwn(queryParameters, "tagIdIn") &&
    !checkIfValueIsStringPositiveIntegers(queryParameters.tagIdIn)
  ) {
    errors.tagIdIn = "must be positive integers delimited by ampersand";
  }

  if (
    Object.hasOwn(queryParameters, "tagIdAll") &&
    !checkIfValueIsStringPositiveIntegers(queryParameters.tagIdAll)
  ) {
    errors.tagIdAll = "must be positive integers delimited by ampersand";
  }

  if (
    Object.hasOwn(queryParameters, "createdAt") &&
    !checkIfValueIsDateString(queryParameters.createdAt)
  ) {
    errors.createdAt =
      'must be string representation of a date in "ISO 8601" format';
  }

  if (
    Object.hasOwn(queryParameters, "createdAtLt") &&
    !checkIfValueIsDateString(queryParameters.createdAtLt)
  ) {
    errors.createdAtLt =
      'must be string representation of a date in "ISO 8601" format';
  }

  if (
    Object.hasOwn(queryParameters, "createdAtGt") &&
    !checkIfValueIsDateString(queryParameters.createdAtGt)
  ) {
    errors.createdAtGt =
      'must be string representation of a date in "ISO 8601" format';
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateOrderQueryParameters(queryParameters: Request["query"]) {
  const errors: { orderBy?: string } = {};

  if (
    Object.hasOwn(queryParameters, "orderBy") &&
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

  if (
    Object.hasOwn(data, "image") &&
    !checkIfValueIsBase64WebpImageDataUrl(data.image)
  ) {
    errors.image =
      'must be base64 image in data URL format with "image/webp" mediatype';
  }

  if (
    Object.hasOwn(data, "extraImages") &&
    !checkIfValueIsBase64WebpImageDataUrls(data.extraImages)
  ) {
    errors.extraImages =
      'must be array of base64 images in data URL format with "image/webp" mediatype';
  }

  if (
    Object.hasOwn(data, "title") &&
    !checkIfValueIsNotEmptyString(data.title)
  ) {
    errors.title = "must be not empty string";
  }

  if (
    Object.hasOwn(data, "content") &&
    !checkIfValueIsNotEmptyString(data.content)
  ) {
    errors.content = "must be not empty string";
  }

  if (
    Object.hasOwn(data, "categoryId") &&
    !checkIfValueIsPositiveInteger(data.categoryId)
  ) {
    errors.categoryId = "must be positive integer";
  }

  if (
    Object.hasOwn(data, "tagIds") &&
    !checkIfValueIsPositiveIntegers(data.tagIds)
  ) {
    errors.tagIds = "must be array of positive integers";
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
