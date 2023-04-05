const path = require("path");
const fs = require("fs");

const { PROJECT_ROOT_PATH } = require("../../shared/constants/paths");

function saveImageToStaticFiles(base64ImageDataUrl, folderName, imageFileName) {
  const [mediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageFileNameWithExtension = `${imageFileName}.${
    mediatype.split("/")[1]
  }`;

  fs.writeFileSync(
    path.join(
      PROJECT_ROOT_PATH,
      "static/images",
      folderName,
      imageFileNameWithExtension
    ),
    Buffer.from(base64Image, "base64")
  );

  return imageFileNameWithExtension;
}

function deleteImageFromStaticFiles(folderName, imageFileNameWithExtension) {
  fs.unlinkSync(
    path.join(
      PROJECT_ROOT_PATH,
      "static/images",
      folderName,
      imageFileNameWithExtension
    )
  );
}

function getImageUrl(folderName, imageFileNameWithExtension) {
  return `http://localhost:3000/static/images/${folderName}/${imageFileNameWithExtension}`;
}

module.exports = {
  saveImageToStaticFiles,
  deleteImageFromStaticFiles,
  getImageUrl,
};
