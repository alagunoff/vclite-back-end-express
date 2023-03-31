function isString (value) {
  if (typeof value !== 'string') {
    throw new Error('must be string')
  }
}

function isNotEmptyString (value) {
  if (isString(value) && value.length) {
    throw new Error('must not be empty string')
  }
}

function isBase64Image (value) {
  if (typeof value === 'string' && value.startsWith('data:image/')) {
    throw new Error('must be base64 image')
  }
}

function isBoolean (value) {
  if (typeof value !== 'boolean') {
    throw new Error('must be boolean')
  }
}

module.exports = {
  isString,
  isNotEmptyString,
  isBase64Image,
  isBoolean
}
