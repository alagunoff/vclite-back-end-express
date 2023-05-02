import { type Request } from "express";

import prisma from "prisma";
import {
  isBase64ImageDataUrl,
  isNotEmptyString,
  isPositiveInteger,
  isStringPositiveInteger,
  isDateString,
  isPositiveIntegersNotEmptyArray,
  isStringPositiveIntegersNotEmptyArray,
  isBase64ImageDataUrlsNotEmptyArray,
} from "shared/validation/utils";

import {
  type CreationDataValidationErrors,
  type FilterQueryParametersValidationErrors,
  type ValidatedFilterQueryParameters,
  type OrderQueryParametersValidationErrors,
  type ValidatedOrderQueryParameters,
} from "./types";
import { ORDER_VALID_VALUES } from "./constants";

async function validateCreationData(
  data: any
): Promise<CreationDataValidationErrors | undefined> {
  const errors: CreationDataValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
      errors.extraImages =
        "must be not empty array of base64 images in data URL formats with mediatypes";
    }
  }

  if ("title" in data) {
    if (!isNotEmptyString(data.title)) {
      errors.title = "must be not empty string";
    }
  } else {
    errors.title = "required";
  }

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
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
  } else {
    errors.categoryId = "required";
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
  } else {
    errors.tagsIds = "required";
  }

  return Object.keys(errors).length ? errors : undefined;
}

function validateFilterQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedFilterQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: FilterQueryParametersValidationErrors;
    } {
  const validatedData: ValidatedFilterQueryParameters = {};
  const errors: FilterQueryParametersValidationErrors = {};

  if ("titleContains" in queryParameters) {
    if (isNotEmptyString(queryParameters.titleContains)) {
      validatedData.titleContains = queryParameters.titleContains;
    } else {
      errors.titleContains = "must be not empty string";
    }
  }

  if ("contentContains" in queryParameters) {
    if (isNotEmptyString(queryParameters.contentContains)) {
      validatedData.contentContains = queryParameters.contentContains;
    } else {
      errors.contentContains = "must be not empty string";
    }
  }

  if ("authorFirstName" in queryParameters) {
    if (isNotEmptyString(queryParameters.authorFirstName)) {
      validatedData.authorFirstName = queryParameters.authorFirstName;
    } else {
      errors.authorFirstName = "must be not empty string";
    }
  }

  if ("categoryId" in queryParameters) {
    if (isStringPositiveInteger(queryParameters.categoryId)) {
      validatedData.categoryId = queryParameters.categoryId;
    } else {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagId" in queryParameters) {
    if (isStringPositiveInteger(queryParameters.tagId)) {
      validatedData.tagId = queryParameters.tagId;
    } else {
      errors.tagId = "must be positive integer";
    }
  }

  if ("tagIdIn" in queryParameters) {
    if (isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdIn)) {
      validatedData.tagIdIn = queryParameters.tagIdIn;
    } else {
      errors.tagIdIn = "must be positive integers delimited by ampersand";
    }
  }

  if ("tagIdAll" in queryParameters) {
    if (isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdAll)) {
      validatedData.tagIdAll = queryParameters.tagIdAll;
    } else {
      errors.tagIdAll = "must be positive integers delimited by ampersand";
    }
  }

  if ("createdAt" in queryParameters) {
    if (isDateString(queryParameters.createdAt)) {
      validatedData.createdAt = queryParameters.createdAt;
    } else {
      errors.createdAt = "must be string representation of a date";
    }
  }

  if ("createdAtLt" in queryParameters) {
    if (isDateString(queryParameters.createdAtLt)) {
      validatedData.createdAtLt = queryParameters.createdAtLt;
    } else {
      errors.createdAtLt = "must be string representation of a date";
    }
  }

  if ("createdAtGt" in queryParameters) {
    if (isDateString(queryParameters.createdAtGt)) {
      validatedData.createdAtGt = queryParameters.createdAtGt;
    } else {
      errors.createdAtGt = "must be string representation of a date";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData,
        errors: undefined,
      };
}

function createFilterParameters({
  titleContains,
  contentContains,
  authorFirstName,
  categoryId,
  tagId,
  tagIdIn,
  tagIdAll,
  createdAt,
  createdAtLt,
  createdAtGt,
}: ValidatedFilterQueryParameters): Record<string, unknown> {
  const filterParameters: Record<string, unknown> = {
    isDraft: false,
  };

  if (titleContains) {
    filterParameters.title = {
      contains: titleContains,
    };
  }

  if (contentContains) {
    filterParameters.content = {
      contains: contentContains,
    };
  }

  if (authorFirstName) {
    filterParameters.author = {
      user: {
        firstName: authorFirstName,
      },
    };
  }

  if (categoryId) {
    filterParameters.category = {
      id: Number(categoryId),
    };
  }

  if (tagId) {
    filterParameters.tags = {
      some: {
        id: Number(tagId),
      },
    };
  }

  if (tagIdIn) {
    filterParameters.OR = tagIdIn.map((tagId) => ({
      tags: {
        some: {
          id: Number(tagId),
        },
      },
    }));
  }

  if (tagIdAll) {
    filterParameters.AND = tagIdAll.map((tagId) => ({
      tags: {
        some: {
          id: Number(tagId),
        },
      },
    }));
  }

  if (createdAt) {
    const desiredDate = new Date(createdAt);
    const nextDayAfterDesiredDate = new Date(createdAt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParameters.createdAt = {
      gte: desiredDate,
      lt: nextDayAfterDesiredDate,
    };
  }

  if (createdAtLt) {
    filterParameters.createdAt = {
      lt: new Date(createdAtLt),
    };
  }

  if (createdAtGt) {
    const nextDayAfterDesiredDate = new Date(createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParameters.createdAt = {
      gte: nextDayAfterDesiredDate,
    };
  }

  return filterParameters;
}

function validateOrderQueryParameters(queryParameters: Request["query"]):
  | {
      validatedData: ValidatedOrderQueryParameters;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: OrderQueryParametersValidationErrors;
    } {
  const validatedData: ValidatedOrderQueryParameters = {};
  const errors: OrderQueryParametersValidationErrors = {};

  if ("orderBy" in queryParameters) {
    if (
      typeof queryParameters.orderBy === "string" &&
      ORDER_VALID_VALUES.includes(queryParameters.orderBy)
    ) {
      validatedData.orderBy = queryParameters.orderBy;
    } else {
      errors.orderBy = `must be one of the following strings [${String(
        ORDER_VALID_VALUES
      )}]`;
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData,
        errors: undefined,
      };
}

function createOrderParameters({
  orderBy,
}: ValidatedOrderQueryParameters): Record<string, unknown> {
  const orderParams: Record<string, unknown> = {};

  if (orderBy === "createdAt") {
    orderParams.createdAt = "asc";
  }

  if (orderBy === "-createdAt") {
    orderParams.createdAt = "desc";
  }

  if (orderBy === "authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "asc",
      },
    };
  }

  if (orderBy === "-authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "desc",
      },
    };
  }

  if (orderBy === "category") {
    orderParams.category = {
      category: "asc",
    };
  }

  if (orderBy === "-category") {
    orderParams.category = {
      category: "desc",
    };
  }

  if (orderBy === "imagesNumber") {
    orderParams.extraImages = {
      _count: "asc",
    };
  }

  if (orderBy === "-imagesNumber") {
    orderParams.extraImages = {
      _count: "desc",
    };
  }

  return orderParams;
}

interface UpdateDataValidationErrors {
  image?: string;
  extraImages?: string;
  title?: string;
  content?: string;
  authorId?: string;
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

  if ("authorId" in data) {
    if (isPositiveInteger(data.authorId)) {
      if (!(await prisma.author.findUnique({ where: { id: data.authorId } }))) {
        errors.authorId = "author with this id doesn't exist";
      }
    } else {
      errors.authorId = "must be positive integer";
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

export {
  validateCreationData,
  validateFilterQueryParameters,
  createFilterParameters,
  validateOrderQueryParameters,
  createOrderParameters,
  validateUpdateData,
};
