const path = require('path')
const fs = require('fs')

function transformErrorsArrayToObject (errors) {
  const result = {}

  errors.forEach(({ path, message }) => {
    result[path] = message
  })

  return result
}

function saveUserImageOnDisk (user) {
  const [mimeType, base64Image] = user.image.slice(5).split(';base64,')
  const imageExtension = mimeType.split('/')[1]
  const imagePath = path.join(__dirname, `../../static/images/users/${user.username}.${imageExtension}`)

  fs.writeFileSync(imagePath, Buffer.from(base64Image, 'base64'))

  return `${user.username}.${imageExtension}`
}

module.exports = {
  transformErrorsArrayToObject,
  saveUserImageOnDisk
}
