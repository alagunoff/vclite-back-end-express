import fs from "node:fs/promises";
import path from "node:path";

import { HOST_NAME, projectAbsolutePath } from "shared/constants";

async function saveImage(
  base64WebpImageDataUrl: string,
  folderName: string,
  imageFileName: string
) {
  const folderToSaveAbsolutePath = `${projectAbsolutePath}/static/images/${folderName}`;

  await fs.mkdir(folderToSaveAbsolutePath, { recursive: true });

  const [imageMediatype, base64Image] = base64WebpImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageExtension = imageMediatype.split("/")[1];
  const imageFileNameWithExtension = `${imageFileName}.${imageExtension}`;

  await fs.writeFile(
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

async function deleteHostedImage(imageUrl: string) {
  await fs.unlink(getHostedImageAbsolutePath(imageUrl));
}

async function deleteHostedImageFolder(imageUrl: string) {
  await fs.rmdir(path.dirname(getHostedImageAbsolutePath(imageUrl)));
}

export {
  saveImage,
  deleteHostedImage,
  deleteHostedImageFolder,
  getHostedImageFolderName,
};
