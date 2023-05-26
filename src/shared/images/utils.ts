import path from "path";
import fs from "fs";

import { HOST_NAME, projectAbsolutePath } from "src/shared/app/constants";

function saveImage(
  base64ImageDataUrl: string,
  folderName: string,
  imageFileName: string
) {
  const folderToSaveAbsolutePath = `${projectAbsolutePath}/static/images/${folderName}`;

  fs.mkdirSync(folderToSaveAbsolutePath, { recursive: true });

  const [imageMediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageExtension = imageMediatype.split("/")[1];
  const imageFileNameWithExtension = `${imageFileName}.${imageExtension}`;

  fs.writeFileSync(
    `${folderToSaveAbsolutePath}/${imageFileNameWithExtension}`,
    Buffer.from(base64Image, "base64url")
  );

  return `${HOST_NAME}/api/static/images/${folderName}/${imageFileNameWithExtension}`;
}

function getHostedImageAbsolutePath(imageUrl: string) {
  return `${projectAbsolutePath}/${imageUrl.replace(`${HOST_NAME}/api/`, "")}`;
}

function getHostedImageFolderName(imageUrl: string) {
  return path.basename(path.dirname(getHostedImageAbsolutePath(imageUrl)));
}

function deleteHostedImage(imageUrl: string) {
  fs.unlinkSync(getHostedImageAbsolutePath(imageUrl));
}

function deleteHostedImageFolder(imageUrl: string) {
  fs.rmSync(path.dirname(getHostedImageAbsolutePath(imageUrl)), {
    recursive: true,
    force: true,
  });
}

export {
  saveImage,
  deleteHostedImage,
  deleteHostedImageFolder,
  getHostedImageFolderName,
};
