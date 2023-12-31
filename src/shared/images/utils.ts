import fsPromises from "node:fs/promises";
import path from "node:path";

import { HOST_URL, projectAbsolutePath } from "shared/constants";

async function saveImage(
  base64WebpImageDataUrl: string,
  folderName: string,
  imageFileName: string
) {
  const folderToSaveAbsolutePath = path.join(
    projectAbsolutePath,
    "static/images",
    folderName
  );

  await fsPromises.mkdir(folderToSaveAbsolutePath, { recursive: true });

  const [imageMediatype, base64Image] = base64WebpImageDataUrl
    .slice(5)
    .split(";base64,");
  const imageExtension = imageMediatype.split("/")[1];
  const imageFileNameWithExtension = `${imageFileName}.${imageExtension}`;

  await fsPromises.writeFile(
    path.join(folderToSaveAbsolutePath, imageFileNameWithExtension),
    Buffer.from(base64Image, "base64url")
  );

  return `${HOST_URL}/api/static/images/${folderName}/${imageFileNameWithExtension}`;
}

function getHostedImageAbsolutePath(imageUrl: string) {
  return path.join(
    projectAbsolutePath,
    imageUrl.replace(`${HOST_URL}/api/`, "")
  );
}

function getHostedImageFolderName(imageUrl: string) {
  return path.basename(path.dirname(getHostedImageAbsolutePath(imageUrl)));
}

async function deleteHostedImage(imageUrl: string) {
  await fsPromises.unlink(getHostedImageAbsolutePath(imageUrl));
}

async function deleteHostedImageFolder(imageUrl: string) {
  await fsPromises.rm(path.dirname(getHostedImageAbsolutePath(imageUrl)), {
    recursive: true,
  });
}

export {
  saveImage,
  deleteHostedImage,
  deleteHostedImageFolder,
  getHostedImageFolderName,
};
