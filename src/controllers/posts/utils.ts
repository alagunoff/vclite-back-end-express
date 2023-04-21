import { type Request } from "express";

function createFilterOptions(req: Request): Record<string, unknown> {
  const result: Record<string, unknown> = {
    isDraft: false,
  };

  if (typeof req.query.titleContains === "string") {
    result.title = {
      contains: req.query.titleContains,
    };
  }

  if (typeof req.query.contentContains === "string") {
    result.content = {
      contains: req.query.contentContains,
    };
  }

  if (typeof req.query.authorFirstName === "string") {
    result.author = {
      user: {
        firstName: req.query.authorFirstName,
      },
    };
  }

  if (typeof req.query.categoryId === "string") {
    result.category = {
      id: Number(req.query.categoryId),
    };
  }

  if (typeof req.query.tagId === "string") {
    result.tags = {
      some: {
        id: Number(req.query.tagId),
      },
    };
  }

  if (typeof req.query.tagIdIn === "string") {
    result.OR = JSON.parse(req.query.tagIdIn).map((desiredTagId: number) => ({
      tags: {
        some: {
          id: desiredTagId,
        },
      },
    }));
  }

  if (typeof req.query.tagIdAll === "string") {
    result.AND = JSON.parse(req.query.tagIdAll).map((desiredTagId: number) => ({
      tags: {
        some: {
          id: desiredTagId,
        },
      },
    }));
  }

  if (typeof req.query.createdAt === "string") {
    const desiredDate = new Date(req.query.createdAt);
    const nextDayAfterDesiredDate = new Date(req.query.createdAt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    result.createdAt = {
      gte: desiredDate,
      lt: nextDayAfterDesiredDate,
    };
  }

  if (typeof req.query.createdAtLt === "string") {
    result.createdAt = {
      lt: new Date(req.query.createdAtLt),
    };
  }

  if (typeof req.query.createdAtGt === "string") {
    const nextDayAfterDesiredDate = new Date(req.query.createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);

    result.createdAt = {
      gte: nextDayAfterDesiredDate,
    };
  }

  return result;
}

// function createOrderOptions(req) {
//   if (req.query.orderBy === "createdAt") {
//     return [["createdAt", "ASC"]];
//   }

//   if (req.query.orderBy === "-createdAt") {
//     return [["createdAt", "DESC"]];
//   }

//   if (req.query.orderBy === "authorName") {
//     return [["author", "user", "firstName", "ASC"]];
//   }

//   if (req.query.orderBy === "-authorName") {
//     return [["author", "user", "firstName", "DESC"]];
//   }

//   if (req.query.orderBy === "categoryName") {
//     return [["category", "category", "ASC"]];
//   }

//   if (req.query.orderBy === "-categoryName") {
//     return [["category", "category", "DESC"]];
//   }

//   if (req.query.orderBy === "imagesNumber") {
//     return [["extraImagesNumber", "ASC"]];
//   }

//   if (req.query.orderBy === "-imagesNumber") {
//     return [["extraImagesNumber", "DESC"]];
//   }
// }

export { createFilterOptions };
