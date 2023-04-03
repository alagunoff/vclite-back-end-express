function isNotEmptyString (value) {
  if (typeof value !== 'string' || !value.length) {
    throw new Error('must be not empty string')
  }
}

function isBase64Image (value) {
  if (typeof value !== 'string' || !/^data:image\/(jpe?g|png);base64,/.test(value)) {
    throw new Error('must be base64 image in data URL format with MIME type')
  }
}

module.exports = {
  isNotEmptyString,
  isBase64Image
}
