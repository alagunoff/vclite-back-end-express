import path from "path";
import fs from "fs";

import { APP_HOST_NAME, PROJECT_ROOT_PATH } from "shared/constants";

function saveImage(
  base64ImageDataUrl: string,
  folderName: string,
  imageFileName: string
): string {
  const [imageMediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageFileNameWithExtension = `${imageFileName}.${
    imageMediatype.split("/")[1]
  }`;

  fs.writeFileSync(
    `${PROJECT_ROOT_PATH}/static/images/${folderName}/${imageFileNameWithExtension}`,
    Buffer.from(base64Image, "base64")
  );

  return `${APP_HOST_NAME}/${folderName}/${imageFileNameWithExtension}`;
}

function getHostedImageSaveAbsolutePath(imageUrl: string): string {
  return path.join(
    PROJECT_ROOT_PATH,
    imageUrl.replace(`${APP_HOST_NAME}/`, "")
  );
}

function getHostedImageFolderAbsolutePath(imageUrl: string): string {
  return path.dirname(getHostedImageSaveAbsolutePath(imageUrl));
}

function getHostedImageFolderName(imageUrl: string): string {
  return path.basename(getHostedImageFolderAbsolutePath(imageUrl));
}

function deleteImage(hostedImageUrl: string): void {
  fs.unlinkSync(getHostedImageSaveAbsolutePath(hostedImageUrl));
}

function deleteFolderByAbsolutePath(folderAbsolutePath: string): void {
  fs.rmSync(folderAbsolutePath, {
    recursive: true,
    force: true,
  });
}

function deleteFolder(folderPath: string): void {
  deleteFolderByAbsolutePath(path.join(PROJECT_ROOT_PATH, folderPath));
}

function deleteImageFolder(hostedImageUrl: string): void {
  deleteFolderByAbsolutePath(getHostedImageFolderAbsolutePath(hostedImageUrl));
}

export {
  saveImage,
  deleteImage,
  getHostedImageSaveAbsolutePath,
  getHostedImageFolderName,
  deleteFolder,
  deleteImageFolder,
};
