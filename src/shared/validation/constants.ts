const VALIDATION_ERROR_MESSAGES = {
  required: "required",
  notEmptyString: "must be not empty string",
  positiveInteger: "must be positive integer",
  positiveIntegersArray: "must be array of positive integers",
  base64WebpImageDataUrl:
    'must be base64 image in data URL format with "image/webp" mediatype',
  base64WebpImageDataUrls:
    'must be array of base64 images in data URL format with "image/webp" mediatype',
  dateString: 'must be string representation of a date in "ISO 8601" format',
} as const;

export { VALIDATION_ERROR_MESSAGES };
