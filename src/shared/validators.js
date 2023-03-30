function isString(value) {
  if (typeof value !== 'string') {
    throw new Error("must be string");
  }
}

function isBoolean(value) {
  if (typeof value !== 'boolean') {
    throw new Error("must be boolean");
  }
}

module.exports = {
  isString,
  isBoolean
}