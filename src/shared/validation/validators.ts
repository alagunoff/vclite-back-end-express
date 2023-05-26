function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length !== 0;
}

function isNotEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length !== 0;
}

function isPositiveInteger(value: unknown) {
  return Number.isInteger(value) && (value as number) > 0;
}

function isStringPositiveInteger(value: unknown) {
  return isPositiveInteger(Number(value));
}

function isBase64ImageDataUrl(value: unknown) {
  return (
    isNotEmptyString(value) && /^data:image\/(jpeg|png);base64,/.test(value)
  );
}

function isDateString(value: unknown) {
  return isNotEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isPositiveIntegersArray(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => !Number.isInteger(item) || (item as number) <= 0)
  );
}

function isStringPositiveIntegersArray(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => {
      const itemAsNumber = Number(item);

      return !Number.isInteger(itemAsNumber) || itemAsNumber <= 0;
    })
  );
}

function isBase64ImageDataUrlsArray(value: unknown) {
  return (
    isNotEmptyArray(value) && !value.some((item) => !isBase64ImageDataUrl(item))
  );
}

export {
  isNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  isBase64ImageDataUrl,
  isDateString,
  isPositiveIntegersArray,
  isStringPositiveIntegersArray,
  isBase64ImageDataUrlsArray,
};
