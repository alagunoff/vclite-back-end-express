const path = require("path");
const fs = require("fs");

const { APP_HOST_NAME, PROJECT_ROOT_PATH } = require("../../shared/constants");

function saveImageToStaticFiles(
  base64ImageDataUrl,
  folderNameToSave,
  imageFileName
) {
  const [imageMediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageFileNameWithExtension = `${imageFileName}.${
    imageMediatype.split("/")[1]
  }`;
  const imageFilePathToSaveFromComputerRoot = path.join(
    PROJECT_ROOT_PATH,
    "static/images",
    folderNameToSave
  );

  fs.mkdirSync(imageFilePathToSaveFromComputerRoot, { recursive: true });
  fs.writeFileSync(
    path.join(imageFilePathToSaveFromComputerRoot, imageFileNameWithExtension),
    Buffer.from(base64Image, "base64")
  );

  return `${APP_HOST_NAME}/${path.join(
    "static/images",
    folderNameToSave,
    imageFileNameWithExtension
  )}`;
}

function deleteImageFromStaticFiles(hostedImageUrl) {
  fs.unlinkSync(
    path.join(
      PROJECT_ROOT_PATH,
      hostedImageUrl.replace(`${APP_HOST_NAME}/`, "")
    )
  );
}

module.exports = {
  saveImageToStaticFiles,
  deleteImageFromStaticFiles,
};
