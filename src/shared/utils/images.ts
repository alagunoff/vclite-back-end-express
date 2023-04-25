import path from "path";
import fs from "fs";

import { APP_HOST_NAME, PROJECT_ROOT_PATH } from "shared/constants";

function saveImage(
  base64ImageDataUrl: string,
  savePath: string,
  imageFileName: string
): string {
  const [imageMediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageFileNameWithExtension = `${imageFileName}.${
    imageMediatype.split("/")[1]
  }`;
  const savePathFromComputerRoot = path.join(PROJECT_ROOT_PATH, savePath);

  fs.mkdirSync(savePathFromComputerRoot, { recursive: true });
  fs.writeFileSync(
    path.join(savePathFromComputerRoot, imageFileNameWithExtension),
    Buffer.from(base64Image, "base64")
  );

  return `${APP_HOST_NAME}/${path.join(savePath, imageFileNameWithExtension)}`;
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

function deleteFolder(folderPath: string): void {
  fs.rmSync(path.join(PROJECT_ROOT_PATH, folderPath), {
    recursive: true,
    force: true,
  });
}

function deleteImageFolder(hostedImageUrl: string): void {
  deleteFolder(getHostedImageFolderAbsolutePath(hostedImageUrl));
}

export {
  saveImage,
  deleteImage,
  getHostedImageSaveAbsolutePath,
  getHostedImageFolderName,
  deleteFolder,
  deleteImageFolder,
};
