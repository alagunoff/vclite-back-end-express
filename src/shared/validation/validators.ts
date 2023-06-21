function checkIfValueIsNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length !== 0;
}

function checkIfValueIsNotEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length !== 0;
}

function checkIfValueIsPositiveInteger(value: unknown) {
  return Number.isInteger(value) && (value as number) > 0;
}

function checkIfValueIsStringPositiveInteger(value: unknown) {
  return checkIfValueIsPositiveInteger(Number(value));
}

function checkIfValueIsBase64WebpImageDataUrl(value: unknown) {
  return (
    checkIfValueIsNotEmptyString(value) &&
    value.startsWith("data:image/webp;base64,")
  );
}

function checkIfValueIsDateString(value: unknown) {
  return (
    checkIfValueIsNotEmptyString(value) && !Number.isNaN(Date.parse(value))
  );
}

function checkIfValueIsPositiveIntegers(value: unknown) {
  return (
    checkIfValueIsNotEmptyArray(value) &&
    !value.some((item) => !Number.isInteger(item) || (item as number) <= 0)
  );
}

function checkIfValueIsStringPositiveIntegers(value: unknown) {
  return (
    checkIfValueIsNotEmptyArray(value) &&
    !value.some((item) => {
      const itemAsNumber = Number(item);

      return !Number.isInteger(itemAsNumber) || itemAsNumber <= 0;
    })
  );
}

function checkIfValueIsBase64WebpImageDataUrls(value: unknown) {
  return (
    checkIfValueIsNotEmptyArray(value) &&
    !value.some((item) => !checkIfValueIsBase64WebpImageDataUrl(item))
  );
}

export {
  checkIfValueIsNotEmptyString,
  checkIfValueIsPositiveInteger,
  checkIfValueIsStringPositiveInteger,
  checkIfValueIsBase64WebpImageDataUrl,
  checkIfValueIsDateString,
  checkIfValueIsPositiveIntegers,
  checkIfValueIsStringPositiveIntegers,
  checkIfValueIsBase64WebpImageDataUrls,
};
