const fs = require("fs");
const path = require("path");
const base64 = require('node-base64-image');

function transformErrorsArrayToObject(errors) {
  const result = {};

  errors.map(({ path, message }) => {
    result[path] = message;
  })

  return result
}

async function saveUserImageOnDisk(username, base64Image) {
  if (checkIfBase64StringIsImage(base64Image)) {
    const image_extension = getBase64ImageExtension(base64Image)

    await base64.decode(base64Image, { fname: path.join(__dirname, `../../static/images/users/${username}`), ext: image_extension })

    return `static/images/users/${username}.${image_extension}`
  }
}

function getBase64ImageExtension(base64Image) {
  return base64Image.split(';')[0].split('/')[1]
}

function checkIfBase64StringIsImage(base64String) {
  return typeof base64String === 'string' && base64String.startsWith('data:image/')
}

module.exports = {
  transformErrorsArrayToObject,
  saveUserImageOnDisk
}