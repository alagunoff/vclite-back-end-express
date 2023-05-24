const ERROR_MESSAGES = {
  required: "required",
  notEmptyString: "must be not empty string",
  positiveInteger: "must be positive integer",
  base64ImageDataUrl:
    "must be base64 image in data URL format with either 'image/jpeg' or 'image/png' mediatype",
} as const;

export { ERROR_MESSAGES };
