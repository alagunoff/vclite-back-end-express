function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length !== 0;
}

function isNotEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length !== 0;
}

function isUsername(value: unknown) {
  return isNotEmptyString(value) && /^[a-z][a-z0-9]*$/.test(value);
}

function isPositiveInteger(value: unknown) {
  return Number.isInteger(value) && (value as number) > 0;
}

function isStringPositiveInteger(value: unknown) {
  return isPositiveInteger(Number(value));
}

function isBase64WebpImageDataUrl(value: unknown) {
  return isNotEmptyString(value) && value.startsWith("data:image/webp;base64,");
}

function isDateString(value: unknown) {
  return isNotEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isPositiveIntegers(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => !Number.isInteger(item) || (item as number) <= 0)
  );
}

function isStringPositiveIntegers(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => {
      const itemAsNumber = Number(item);

      return !Number.isInteger(itemAsNumber) || itemAsNumber <= 0;
    })
  );
}

function isBase64WebpImageDataUrls(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => !isBase64WebpImageDataUrl(item))
  );
}

export {
  isNotEmptyString,
  isUsername,
  isPositiveInteger,
  isStringPositiveInteger,
  isBase64WebpImageDataUrl,
  isDateString,
  isPositiveIntegers,
  isStringPositiveIntegers,
  isBase64WebpImageDataUrls,
};
