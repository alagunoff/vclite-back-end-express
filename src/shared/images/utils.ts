import path from "path";
import fs from "fs";

import { APP_HOST_NAME, projectAbsolutePath } from "shared/constants";

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
  const folderAbsolutePath = `${projectAbsolutePath}/static/images/${folderName}`;

  fs.mkdirSync(folderAbsolutePath, { recursive: true });
  fs.writeFileSync(
    `${folderAbsolutePath}/${imageFileNameWithExtension}`,
    Buffer.from(base64Image, "base64")
  );

  return `${APP_HOST_NAME}/api/static/images/${folderName}/${imageFileNameWithExtension}`;
}

function getHostedImageAbsolutePath(imageUrl: string): string {
  return `${projectAbsolutePath}/${imageUrl.replace(
    `${APP_HOST_NAME}/api/`,
    ""
  )}`;
}

function getHostedImageFolderName(imageUrl: string): string {
  return path.basename(path.dirname(getHostedImageAbsolutePath(imageUrl)));
}

function deleteHostedImage(imageUrl: string): void {
  fs.unlinkSync(getHostedImageAbsolutePath(imageUrl));
}

function deleteHostedImageFolder(imageUrl: string): void {
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
