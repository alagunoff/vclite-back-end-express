import { type Request } from "express";

function createFilterParameters(req: Request): Record<string, unknown> {
  const filterParams: Record<string, unknown> = {
    isDraft: false,
  };

  if (typeof req.query.titleContains === "string") {
    filterParams.title = {
      contains: req.query.titleContains,
    };
  }

  if (typeof req.query.contentContains === "string") {
    filterParams.content = {
      contains: req.query.contentContains,
    };
  }

  if (typeof req.query.authorFirstName === "string") {
    filterParams.author = {
      user: {
        firstName: req.query.authorFirstName,
      },
    };
  }

  if (typeof req.query.categoryId === "string") {
    filterParams.category = {
      id: Number(req.query.categoryId),
    };
  }

  if (typeof req.query.tagId === "string") {
    filterParams.tags = {
      some: {
        id: Number(req.query.tagId),
      },
    };
  }

  if (typeof req.query.tagIdIn === "string") {
    filterParams.OR = JSON.parse(req.query.tagIdIn).map(
      (desiredTagId: number) => ({
        tags: {
          some: {
            id: desiredTagId,
          },
        },
      })
    );
  }

  if (typeof req.query.tagIdAll === "string") {
    filterParams.AND = JSON.parse(req.query.tagIdAll).map(
      (desiredTagId: number) => ({
        tags: {
          some: {
            id: desiredTagId,
          },
        },
      })
    );
  }

  if (typeof req.query.createdAt === "string") {
    const desiredDate = new Date(req.query.createdAt);
    const nextDayAfterDesiredDate = new Date(req.query.createdAt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParams.createdAt = {
      gte: desiredDate,
      lt: nextDayAfterDesiredDate,
    };
  }

  if (typeof req.query.createdAtLt === "string") {
    filterParams.createdAt = {
      lt: new Date(req.query.createdAtLt),
    };
  }

  if (typeof req.query.createdAtGt === "string") {
    const nextDayAfterDesiredDate = new Date(req.query.createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    filterParams.createdAt = {
      gte: nextDayAfterDesiredDate,
    };
  }

  return filterParams;
}

function createOrderParameters(req: Request): Record<string, unknown> {
  const orderParams: Record<string, unknown> = {};

  if (req.query.orderBy === "createdAt") {
    orderParams.createdAt = "asc";
  }

  if (req.query.orderBy === "-createdAt") {
    orderParams.createdAt = "desc";
  }

  if (req.query.orderBy === "authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "asc",
      },
    };
  }

  if (req.query.orderBy === "-authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "desc",
      },
    };
  }

  if (req.query.orderBy === "category") {
    orderParams.category = {
      category: "asc",
    };
  }

  if (req.query.orderBy === "-category") {
    orderParams.category = {
      category: "desc",
    };
  }

  if (req.query.orderBy === "imagesNumber") {
    orderParams.extraImages = {
      _count: "asc",
    };
  }

  if (req.query.orderBy === "-imagesNumber") {
    orderParams.extraImages = {
      _count: "desc",
    };
  }

  return orderParams;
}

export { createFilterParameters, createOrderParameters };
