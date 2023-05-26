const ERROR_MESSAGES = {
  required: "required",
  notEmptyString: "must be not empty string",
  positiveInteger: "must be positive integer",
  positiveIntegersArray: "must be positive integers array",
  base64ImageDataUrl:
    'must be base64 image in data URL format with either "image/jpeg" or "image/png" mediatype',
  base64ImageDataUrlsArray:
    'must be array of base64 images in data URL formats with either "image/jpeg" or "image/png" mediatypes',
  date: 'must be string representation of a date in "ISO 8601" format',
} as const;

export { ERROR_MESSAGES };
