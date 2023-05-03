import {
  type ValidatedFilterQueryParameters,
  type ValidatedOrderQueryParameters,
} from "./types";

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

export { createFilterParameters, createOrderParameters };
