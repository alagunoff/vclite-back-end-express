function isNotEmptyString(value: unknown): boolean {
  return typeof value === "string" && value !== "";
}

function isBase64ImageDataUrl(value: unknown): boolean {
  return (
    typeof value === "string" && /^data:image\/(jpe?g|png);base64,/.test(value)
  );
}

export { isNotEmptyString, isBase64ImageDataUrl };
