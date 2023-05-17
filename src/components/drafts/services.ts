import { Prisma, type Post } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";
import { includeSubcategories } from "src/components/categories/utils";

async function getAuthorDrafts(
  authorId: number,
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    drafts: Array<Omit<Post, "authorId" | "categoryId" | "isDraft">>,
    draftsTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const drafts = await prisma.post.findMany({
    where: {
      authorId,
      isDraft: true,
    },
    ...createPaginationParameters(validatedPaginationQueryParameters),
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      image: true,
      extraImages: {
        select: {
          id: true,
          image: true,
        },
      },
      title: true,
      content: true,
      author: {
        select: {
          id: true,
          description: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
        },
      },
      createdAt: true,
    },
  });
  const draftsTotalNumber = await prisma.post.count({
    where: {
      authorId,
      isDraft: true,
    },
  });

  for (const draft of drafts) {
    await includeSubcategories(draft.category);
  }

  onSuccess(
    drafts,
    draftsTotalNumber,
    calculatePagesTotalNumber(draftsTotalNumber, drafts.length)
  );
}

async function publishAuthorDraft(
  authorId: number,
  draftId: number,
  onSuccess: () => void,
  onFailure: (reason?: "draftNotFound") => void
): Promise<void> {
  try {
    await prisma.post.update({
      where: {
        id: draftId,
        authorId,
        isDraft: true,
      },
      data: {
        isDraft: false,
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("draftNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { getAuthorDrafts, publishAuthorDraft };
