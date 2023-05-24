function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}

function isStringPositiveInteger(value: unknown): value is string {
  return isPositiveInteger(Number(value));
}

function isBase64ImageDataUrl(value: unknown): boolean {
  return (
    typeof value === "string" && /^data:image\/(jpeg|png);base64,/.test(value)
  );
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" ? !Number.isNaN(Date.parse(value)) : false;
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

function isStringPositiveIntegersNotEmptyArray(
  value: unknown
): value is string[] {
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

export {
  isNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  isBase64ImageDataUrl,
  isDateString,
  isPositiveIntegersNotEmptyArray,
  isStringPositiveIntegersNotEmptyArray,
  isBase64ImageDataUrlsNotEmptyArray,
};
