function transformStringToLowercasedKebabString (string) {
  return string
    .split(' ')
    .map((word) => word.toLowerCase())
    .join('-')
}

module.exports = {
  transformStringToLowercasedKebabString
}
