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

function isPositiveIntegersArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    !value.some(
      (item: unknown) => !Number.isInteger(item) || (item as number) <= 0
    )
  );
}

function isPositiveIntegersArrayString(value: unknown): boolean {
  if (typeof value === "string") {
    const parsedValue = JSON.parse(value);

    return (
      Array.isArray(parsedValue) &&
      !parsedValue.some(
        (item: unknown) => !Number.isInteger(item) || (item as number) <= 0
      )
    );
  }

  return false;
}

function isBase64ImageDataUrlsArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
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
  isPositiveIntegersArray,
  isPositiveIntegersArrayString,
  isBase64ImageDataUrlsArray,
  validatePaginationQueryParameters,
};
export type { PaginationQueryParametersValidationErrors };
