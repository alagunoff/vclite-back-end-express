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

function createValidationResult(errors: Record<string, string>):
  | {
      isValid: true;
      errors: null;
    }
  | {
      isValid: false;
      errors: Record<string, string>;
    } {
  return Object.keys(errors).length
    ? { isValid: false, errors }
    : { isValid: true, errors: null };
}

export {
  isNotEmptyString,
  isPositiveInteger,
  isBase64ImageDataUrl,
  createValidationResult,
};
