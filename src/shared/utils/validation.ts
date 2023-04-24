function isNotEmptyString(value: unknown): boolean {
  return typeof value === "string" && value !== "";
}

function isPositiveInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) > 0;
}

function isBase64ImageDataUrl(value: unknown): value is `data:image/${string}` {
  return (
    typeof value === "string" && /^data:image\/(jpe?g|png);base64,/.test(value)
  );
}

function isNumericArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    !value.some(
      (item: unknown) => !Number.isInteger(item) || (item as number) <= 0
    )
  );
}

function isBase64ImageDataUrlsArray(
  value: unknown
): value is Array<`data:image/${string}`> {
  return (
    Array.isArray(value) &&
    !value.some((item: unknown) => !isBase64ImageDataUrl(item))
  );
}

function validatePaginationQueryParameters(
  queryParams: Record<string, unknown>
): Record<string, string> | undefined {
  const errors: Record<string, string> = {};

  if ("pageNumber" in queryParams) {
    if (!isPositiveInteger(Number(queryParams.pageNumber))) {
      errors.pageNumber = "must be positive integer";
    }

    if (!("itemsNumber" in queryParams)) {
      errors.itemsNumber = "required";
    }
  }

  if ("itemsNumber" in queryParams) {
    if (!isPositiveInteger(Number(queryParams.itemsNumber))) {
      errors.itemsNumber = "must be positive integer";
    }

    if (!("pageNumber" in queryParams)) {
      errors.pageNumber = "required";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export {
  isNotEmptyString,
  isPositiveInteger,
  isBase64ImageDataUrl,
  isNumericArray,
  isBase64ImageDataUrlsArray,
  validatePaginationQueryParameters,
};
