import { type Request } from "express";

function isNotEmptyString(value: unknown): boolean {
  return typeof value === "string" && value !== "";
}

function isPositiveInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) > 0;
}

function isBase64ImageDataUrl(value: unknown): boolean {
  return (
    typeof value === "string" && /^data:image\/(jpe?g|png);base64,/.test(value)
  );
}

function isDateString(value: unknown): boolean {
  if (typeof value === "string") {
    return !Number.isNaN(Date.parse(value));
  }

  return false;
}

function isPositiveIntegersNotEmptyArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    !!value.length &&
    !value.some(
      (item: unknown) => !Number.isInteger(item) || (item as number) <= 0
    )
  );
}

function isStringPositiveIntegersNotEmptyArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    !!value.length &&
    !value.some((item: unknown) => {
      const itemAsNumber = Number(item);

      return !Number.isInteger(itemAsNumber) || itemAsNumber <= 0;
    })
  );
}

function isBase64ImageDataUrlsNotEmptyArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    !!value.length &&
    !value.some((item: unknown) => !isBase64ImageDataUrl(item))
  );
}

interface PaginationQueryParametersValidationErrors {
  pageNumber?: string;
  itemsNumber?: string;
}

function validatePaginationQueryParameters(
  queryParameters: Request["query"]
): PaginationQueryParametersValidationErrors | undefined {
  const errors: PaginationQueryParametersValidationErrors = {};

  if ("pageNumber" in queryParameters) {
    if (!isPositiveInteger(Number(queryParameters.pageNumber))) {
      errors.pageNumber = "must be positive integer";
    }

    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = "required";
    }
  }

  if ("itemsNumber" in queryParameters) {
    if (!isPositiveInteger(Number(queryParameters.itemsNumber))) {
      errors.itemsNumber = "must be positive integer";
    }

    if (!("pageNumber" in queryParameters)) {
      errors.pageNumber = "required";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export {
  isNotEmptyString,
  isPositiveInteger,
  isBase64ImageDataUrl,
  isDateString,
  isPositiveIntegersNotEmptyArray,
  isStringPositiveIntegersNotEmptyArray,
  isBase64ImageDataUrlsNotEmptyArray,
  validatePaginationQueryParameters,
};
export type { PaginationQueryParametersValidationErrors };
