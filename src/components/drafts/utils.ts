import prisma from "prisma";
import {
  isBase64ImageDataUrl,
  isNotEmptyString,
  isPositiveInteger,
  isPositiveIntegersNotEmptyArray,
  isBase64ImageDataUrlsNotEmptyArray,
} from "shared/validation/utils";

interface UpdateDataValidationErrors {
  image?: string;
  extraImages?: string;
  title?: string;
  content?: string;
  categoryId?: string;
  tagsIds?: string | Record<number, string>;
}

async function validateUpdateData(
  data: any
): Promise<UpdateDataValidationErrors | undefined> {
  const errors: UpdateDataValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
      errors.extraImages =
        "must be array of base64 images in data URL formats with mediatypes";
    }
  }

  if ("title" in data) {
    if (!isNotEmptyString(data.title)) {
      errors.title = "must be not empty string";
    }
  }

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  }

  if ("categoryId" in data) {
    if (isPositiveInteger(data.categoryId)) {
      if (
        !(await prisma.category.findUnique({ where: { id: data.categoryId } }))
      ) {
        errors.categoryId = "category with this id doesn't exist";
      }
    } else {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagsIds" in data) {
    if (isPositiveIntegersNotEmptyArray(data.tagsIds)) {
      for (const tagId of data.tagsIds) {
        const tag = await prisma.tag.findUnique({
          where: { id: tagId },
        });

        if (!tag) {
          const errorMessage = "tag with this id doesn't exist";

          if ("tagsIds" in errors && typeof errors.tagsIds === "object") {
            errors.tagsIds[tagId] = errorMessage;
          } else {
            errors.tagsIds = {
              [tagId]: errorMessage,
            };
          }
        }
      }
    } else {
      errors.tagsIds = "must be not empty positive integers array";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateUpdateData };
