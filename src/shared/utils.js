const path = require('path')
const fs = require('fs')

function transformErrorsArrayToObject (errors) {
  const result = {}

  errors.forEach(({ path, message }) => {
    result[path] = message
  })

  return result
}

function getBase64ImageExtension (base64Image) {
  return base64Image.split(';')[0].split('/')[1]
}

function saveUserImageOnDisk (username, base64Image) {
  const imagePath = path.join(__dirname, `../../static/images/users/${username}.${getBase64ImageExtension(base64Image)}`)

  fs.writeFileSync(imagePath, Buffer.from(base64Image, 'base64'))

  return imagePath
}

module.exports = {
  transformErrorsArrayToObject,
  saveUserImageOnDisk
}
