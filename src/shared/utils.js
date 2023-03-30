const path = require("path");
const base64 = require('node-base64-image');

function transformErrorsArrayToObject(errors) {
  const result = {};

  errors.map(({ path, message }) => {
    result[path] = message;
  })

  return result
}

function checkIfValueIsBase64Image(value) {
  return typeof value === 'string' && value.startsWith('data:image/')
}

function getBase64ImageExtension(base64Image) {
  return base64Image.split(';')[0].split('/')[1]
}

async function saveUserImageOnDisk(username, base64Image) {
  const image_extension = getBase64ImageExtension(base64Image)

  await base64.decode(base64Image, { fname: path.join(__dirname, `../../static/images/users/${username}`), ext: image_extension })

  return `static/images/users/${username}.${image_extension}`
}





module.exports = {
  transformErrorsArrayToObject,
  checkIfValueIsBase64Image,
  saveUserImageOnDisk,
}