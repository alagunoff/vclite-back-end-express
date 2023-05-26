import { type Prisma } from "@prisma/client";

import { type ORDER_VALID_OPTIONS } from "./constants";

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
}: {
  titleContains?: string;
  contentContains?: string;
  authorFirstName?: string;
  categoryId?: string;
  tagId?: string;
  tagIdIn?: string[];
  tagIdAll?: string[];
  createdAt?: string;
  createdAtLt?: string;
  createdAtGt?: string;
}) {
  const filterParameters: Prisma.PostWhereInput = { isDraft: false };

  if (titleContains) {
    filterParameters.title = { contains: titleContains };
  }

  if (contentContains) {
    filterParameters.content = { contains: contentContains };
  }

  if (authorFirstName) {
    filterParameters.author = { user: { firstName: authorFirstName } };
  }

  if (categoryId) {
    filterParameters.category = { id: Number(categoryId) };
  }

  if (tagId) {
    filterParameters.tags = { some: { id: Number(tagId) } };
  }

  if (tagIdIn) {
    filterParameters.OR = tagIdIn.map((tagId) => ({
      tags: { some: { id: Number(tagId) } },
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
    filterParameters.createdAt = { lt: new Date(createdAtLt) };
  }

  if (createdAtGt) {
    const nextDayAfterDesiredDate = new Date(createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParameters.createdAt = { gte: nextDayAfterDesiredDate };
  }

  return filterParameters;
}

function createOrderParameters({
  orderBy,
}: {
  orderBy?: (typeof ORDER_VALID_OPTIONS)[number];
}): Prisma.PostOrderByWithRelationInput {
  switch (orderBy) {
    case "createdAt":
      return { createdAt: "asc" };
    case "-createdAt":
      return { createdAt: "desc" };
    case "authorFirstName":
      return { author: { user: { firstName: "asc" } } };
    case "-authorFirstName":
      return { author: { user: { firstName: "desc" } } };
    case "categoryName":
      return { category: { name: "asc" } };
    case "-categoryName":
      return { category: { name: "desc" } };
    case "imagesNumber":
      return { extraImages: { _count: "asc" } };
    case "-imagesNumber":
      return { extraImages: { _count: "desc" } };
  }

  return { id: "asc" };
}

export { createFilterParameters, createOrderParameters };
