import path from 'path'
import fs from 'fs'

import { APP_HOST_NAME, PROJECT_ROOT_PATH } from 'shared/constants'

function saveImageToStaticFiles (
  base64ImageDataUrl: string,
  folderNameToSave: string,
  imageFileName: string
): string {
  const [imageMediatype, base64Image] = base64ImageDataUrl
    .slice(5)
    .split(';base64,')
  const imageFileNameWithExtension = `${imageFileName}.${
    imageMediatype.split('/')[1]
  }`
  const imageFilePathToSaveFromComputerRoot = path.join(
    PROJECT_ROOT_PATH,
    'static/images',
    folderNameToSave
  )

  fs.mkdirSync(imageFilePathToSaveFromComputerRoot, { recursive: true })
  fs.writeFileSync(
    path.join(imageFilePathToSaveFromComputerRoot, imageFileNameWithExtension),
    Buffer.from(base64Image, 'base64')
  )

  return `${APP_HOST_NAME}/${path.join(
    'static/images',
    folderNameToSave,
    imageFileNameWithExtension
  )}`
}

function deleteImageFromStaticFiles (hostedImageUrl: string): void {
  fs.unlinkSync(getImageLocalPathFromHostedImageUrl(hostedImageUrl))
}

function deleteImageFolderFromStaticFiles (hostedImageUrl: string): void {
  fs.rmSync(path.dirname(getImageLocalPathFromHostedImageUrl(hostedImageUrl)), {
    recursive: true,
    force: true
  })
}

function getImageLocalPathFromHostedImageUrl (hostedImageUrl: string): string {
  return path.join(
    PROJECT_ROOT_PATH,
    hostedImageUrl.replace(`${APP_HOST_NAME}/`, '')
  )
}

export {
  saveImageToStaticFiles,
  deleteImageFromStaticFiles,
  deleteImageFolderFromStaticFiles
}
