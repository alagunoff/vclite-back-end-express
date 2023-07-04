import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

async function createComment(creationData: {
  content: string;
  postId: number;
}) {
  if (
    !(await prisma.post.findUnique({
      where: { id: creationData.postId, isDraft: false },
    }))
  ) {
    return new ApiError(422);
  }

  await prisma.comment.create({ data: creationData });
}

async function getComments(
  filterParameters: Prisma.CommentFindManyArgs["where"],
  paginationParameters: PaginationParameters
) {
  const comments = await prisma.comment.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: DEFAULT_ORDER_PARAMETERS,
    select: { id: true, content: true },
  });
  const commentsTotalNumber = await prisma.comment.count({
    where: filterParameters,
  });

  return {
    comments,
    commentsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      commentsTotalNumber,
      paginationParameters.take
    ),
  };
}

async function deleteComments(
  filterParameters: Prisma.CommentDeleteManyArgs["where"]
) {
  await prisma.comment.deleteMany({ where: filterParameters });
}

export { createComment, getComments, deleteComments };
