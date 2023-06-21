function checkIfValueIsNotEmptyString(value: unknown): value is string {
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

function checkIfValueIsBase64WebpImageDataUrl(value: unknown) {
  return (
    checkIfValueIsNotEmptyString(value) &&
    value.startsWith("data:image/webp;base64,")
  );
}

function isDateString(value: unknown) {
  return (
    checkIfValueIsNotEmptyString(value) && !Number.isNaN(Date.parse(value))
  );
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

function checkIfValueIsBase64WebpImageDataUrls(value: unknown) {
  return (
    isNotEmptyArray(value) &&
    !value.some((item) => !checkIfValueIsBase64WebpImageDataUrl(item))
  );
}

export {
  checkIfValueIsNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  checkIfValueIsBase64WebpImageDataUrl,
  isDateString,
  isPositiveIntegers,
  isStringPositiveIntegers,
  checkIfValueIsBase64WebpImageDataUrls,
};
