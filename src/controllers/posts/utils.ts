import { type Request } from "express";

import prisma from "prisma";
import {
  isBase64ImageDataUrl,
  isNotEmptyString,
  isPositiveInteger,
  isDateString,
  isPositiveIntegersArray,
  isPositiveIntegersArrayString,
  isBase64ImageDataUrlsArray,
  validatePaginationQueryParameters,
  type PaginationQueryParametersValidationErrors,
} from "shared/utils/validation";

interface CreationDataValidationErrors {
  image?: string;
  title?: string;
  content?: string;
  categoryId?: string;
  tagsIds?: string | Record<number, string>;
  extraImages?: string;
}

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
  }

  if ("categoryId" in data) {
    if (isPositiveInteger(data.categoryId)) {
      if (
        !(await prisma.category.findUnique({ where: { id: data.categoryId } }))
      ) {
        errors.categoryId = "category with this id wasn't found";
      }
    } else {
      errors.categoryId = "must be positive integer";
    }
  } else {
    errors.categoryId = "required";
  }

  if ("tagsIds" in data) {
    const tagsIds = data.tagsIds;

    if (isPositiveIntegersArray(tagsIds)) {
      for (const tagId of tagsIds) {
        const tag = await prisma.tag.findUnique({
          where: { id: tagId },
        });

        if (!tag) {
          if ("tagsIds" in errors && typeof errors.tagsIds === "object") {
            errors.tagsIds[tagId] = "tag with this id wasn't found";
          } else {
            errors.tagsIds = {
              [tagId]: "tag with this id wasn't found",
            };
          }
        }
      }
    } else {
      errors.tagsIds = "must be numeric array with positive integers";
    }
  } else {
    errors.tagsIds = "required";
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsArray(data.extraImages)) {
      errors.extraImages =
        "must be array of base64 images in data URL formats with mediatypes";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

interface FilterQueryParametersValidationErrors {
  titleContains?: string;
  contentContains?: string;
  authorFirstName?: string;
  categoryId?: string;
  tagId?: string;
  tagIdIn?: string;
  tagIdAll?: string;
  createdAt?: string;
  createdAtLt?: string;
  createdAtGt?: string;
}

function validateFilterQueryParameters(
  queryParameters: Request["query"]
): FilterQueryParametersValidationErrors | undefined {
  const errors: FilterQueryParametersValidationErrors = {};

  if ("titleContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.titleContains)) {
      errors.titleContains = "must be not empty string";
    }
  }

  if ("contentContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.contentContains)) {
      errors.contentContains = "must be not empty string";
    }
  }

  if ("authorFirstName" in queryParameters) {
    if (!isNotEmptyString(queryParameters.authorFirstName)) {
      errors.authorFirstName = "must be not empty string";
    }
  }

  if ("categoryId" in queryParameters) {
    if (!isPositiveInteger(Number(queryParameters.categoryId))) {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagId" in queryParameters) {
    if (!isPositiveInteger(Number(queryParameters.tagId))) {
      errors.tagId = "must be positive integer";
    }
  }

  if ("tagIdIn" in queryParameters) {
    if (!isPositiveIntegersArrayString(queryParameters.tagIdIn)) {
      errors.tagIdIn = "must be numeric array with positive integers";
    }
  }

  if ("tagIdAll" in queryParameters) {
    if (!isPositiveIntegersArrayString(queryParameters.tagIdAll)) {
      errors.tagIdAll = "must be numeric array with positive integers";
    }
  }

  if ("createdAt" in queryParameters) {
    if (!isDateString(queryParameters.createdAt)) {
      errors.createdAt = "must be string representation of a date";
    }
  }

  if ("createdAtLt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtLt)) {
      errors.createdAtLt = "must be string representation of a date";
    }
  }

  if ("createdAtGt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtGt)) {
      errors.createdAtGt = "must be string representation of a date";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

function createFilterParameters(
  queryParameters: {
    titleContains?: string;
    contentContains?: string;
    authorFirstName?: string;
    categoryId?: string;
    tagId?: string;
    tagIdIn?: string;
    tagIdAll?: string;
    createdAt?: string;
    createdAtLt?: string;
    createdAtGt?: string;
  } & Request["query"]
): Record<string, unknown> {
  const filterParameters: Record<string, unknown> = {
    isDraft: false,
  };

  if (queryParameters.titleContains !== undefined) {
    filterParameters.title = {
      contains: queryParameters.titleContains,
    };
  }

  if (queryParameters.contentContains !== undefined) {
    filterParameters.content = {
      contains: queryParameters.contentContains,
    };
  }

  if (queryParameters.authorFirstName !== undefined) {
    filterParameters.author = {
      user: {
        firstName: queryParameters.authorFirstName,
      },
    };
  }

  if (queryParameters.categoryId !== undefined) {
    filterParameters.category = {
      id: Number(queryParameters.categoryId),
    };
  }

  if (queryParameters.tagId !== undefined) {
    filterParameters.tags = {
      some: {
        id: Number(queryParameters.tagId),
      },
    };
  }

  if (queryParameters.tagIdIn !== undefined) {
    filterParameters.OR = JSON.parse(queryParameters.tagIdIn).map(
      (tagId: number) => ({
        tags: {
          some: {
            id: tagId,
          },
        },
      })
    );
  }

  if (queryParameters.tagIdAll !== undefined) {
    filterParameters.AND = JSON.parse(queryParameters.tagIdAll).map(
      (tagId: number) => ({
        tags: {
          some: {
            id: tagId,
          },
        },
      })
    );
  }

  if (queryParameters.createdAt !== undefined) {
    const desiredDate = new Date(queryParameters.createdAt);
    const nextDayAfterDesiredDate = new Date(queryParameters.createdAt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParameters.createdAt = {
      gte: desiredDate,
      lt: nextDayAfterDesiredDate,
    };
  }

  if (queryParameters.createdAtLt !== undefined) {
    filterParameters.createdAt = {
      lt: new Date(queryParameters.createdAtLt),
    };
  }

  if (queryParameters.createdAtGt !== undefined) {
    const nextDayAfterDesiredDate = new Date(queryParameters.createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParameters.createdAt = {
      gte: nextDayAfterDesiredDate,
    };
  }

  return filterParameters;
}

interface OrderQueryParametersValidationErrors {
  orderBy?: string;
}

const orderValidValues = [
  "createdAt",
  "-createdAt",
  "authorFirstName",
  "-authorFirstName",
  "category",
  "-category",
  "imagesNumber",
  "-imagesNumber",
];

function validateOrderQueryParameters(
  queryParameters: Request["query"]
): OrderQueryParametersValidationErrors | undefined {
  const errors: OrderQueryParametersValidationErrors = {};

  if ("orderBy" in queryParameters) {
    if (
      queryParameters.orderBy !== "string" ||
      !orderValidValues.includes(queryParameters.orderBy)
    ) {
      errors.orderBy = `must be one of the following values [${String(
        orderValidValues
      )}]`;
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

function createOrderParameters(
  queryParameters: {
    orderBy?: string;
  } & Request["query"]
): Record<string, unknown> {
  const orderParams: Record<string, unknown> = {};

  if (queryParameters.orderBy === "createdAt") {
    orderParams.createdAt = "asc";
  }

  if (queryParameters.orderBy === "-createdAt") {
    orderParams.createdAt = "desc";
  }

  if (queryParameters.orderBy === "authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "asc",
      },
    };
  }

  if (queryParameters.orderBy === "-authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "desc",
      },
    };
  }

  if (queryParameters.orderBy === "category") {
    orderParams.category = {
      category: "asc",
    };
  }

  if (queryParameters.orderBy === "-category") {
    orderParams.category = {
      category: "desc",
    };
  }

  if (queryParameters.orderBy === "imagesNumber") {
    orderParams.extraImages = {
      _count: "asc",
    };
  }

  if (queryParameters.orderBy === "-imagesNumber") {
    orderParams.extraImages = {
      _count: "desc",
    };
  }

  return orderParams;
}

interface GetRequestValidationErrors {
  paginationQueryParameters?: PaginationQueryParametersValidationErrors;
  filterQueryParameters?: FilterQueryParametersValidationErrors;
  orderQueryParameters?: OrderQueryParametersValidationErrors;
}

function validateGetRequest(
  queryParameters: Request["query"]
): GetRequestValidationErrors | undefined {
  const filterQueryParametersValidationErrors =
    validateFilterQueryParameters(queryParameters);
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(queryParameters);
  const orderQueryParametersValidationErrors =
    validateOrderQueryParameters(queryParameters);
  const errors: GetRequestValidationErrors = {};

  if (filterQueryParametersValidationErrors) {
    errors.filterQueryParameters = filterQueryParametersValidationErrors;
  }

  if (paginationQueryParametersValidationErrors) {
    errors.paginationQueryParameters =
      paginationQueryParametersValidationErrors;
  }

  if (orderQueryParametersValidationErrors) {
    errors.orderQueryParameters = orderQueryParametersValidationErrors;
  }

  return Object.keys(errors).length ? errors : undefined;
}

interface UpdateDataValidationErrors {
  image?: string;
  title?: string;
  content?: string;
  categoryId?: string;
  tagsIds?: string | Record<number, string>;
  extraImages?: string;
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
        errors.categoryId = "category with this id wasn't found";
      }
    } else {
      errors.categoryId = "must be positive integer";
    }
  }

  if ("tagsIds" in data) {
    const tagsIds = data.tagsIds;

    if (isPositiveIntegersArray(tagsIds)) {
      for (const tagId of tagsIds) {
        const tag = await prisma.tag.findUnique({
          where: { id: tagId },
        });

        if (!tag) {
          if ("tagsIds" in errors && typeof errors.tagsIds === "object") {
            errors.tagsIds[tagId] = "tag with this id wasn't found";
          } else {
            errors.tagsIds = {
              [tagId]: "tag with this id wasn't found",
            };
          }
        }
      }
    } else {
      errors.tagsIds = "must be numeric array with positive integers";
    }
  }

  if ("extraImages" in data) {
    if (!isBase64ImageDataUrlsArray(data.extraImages)) {
      errors.extraImages =
        "must be array of base64 images in data URL formats with mediatypes";
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
  validateGetRequest,
  validateUpdateData,
};
