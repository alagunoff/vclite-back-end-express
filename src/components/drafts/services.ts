import { Prisma, type Post } from "@prisma/client";

import prisma from "src/shared/prisma";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "src/shared/images/utils";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";
import { type ValidatedUpdateData } from "src/components/posts/types";
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

async function updateAuthorDraft(
  authorId: number,
  draftId: number,
  {
    image,
    extraImages,
    title,
    content,
    categoryId,
    tagsIds,
  }: ValidatedUpdateData,
  onSuccess: () => void,
  onFailure: (
    reason?: "draftNotFound" | "categoryNotFound" | "someTagNotFound"
  ) => void
): Promise<void> {
  try {
    const updatedDraft = await prisma.post.update({
      where: {
        id: draftId,
        authorId,
        isDraft: true,
      },
      data: {
        title,
        content,
        categoryId,
        tags: tagsIds
          ? {
              set: tagsIds.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
    });

    if (image ?? extraImages) {
      const updatedDraftImagesFolderName = `posts/${getHostedImageFolderName(
        updatedDraft.image
      )}`;

      if (image) {
        saveImage(image, updatedDraftImagesFolderName, "main");
      }

      if (extraImages) {
        const updatedDraftExtraImages = await prisma.postExtraImage.findMany({
          where: {
            postId: updatedDraft.id,
          },
        });

        for (const extraImage of updatedDraftExtraImages) {
          const deletedExtraImage = await prisma.postExtraImage.delete({
            where: {
              id: extraImage.id,
            },
          });

          deleteHostedImage(deletedExtraImage.image);
        }

        await prisma.post.update({
          where: {
            id: updatedDraft.id,
          },
          data: {
            extraImages: {
              createMany: {
                data: extraImages.map((extraImage, index) => ({
                  image: saveImage(
                    extraImage,
                    updatedDraftImagesFolderName,
                    `extra-${index}`
                  ),
                })),
              },
            },
          },
        });
      }
    }

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure(
            error.meta?.cause === "Record to update not found."
              ? "draftNotFound"
              : "someTagNotFound"
          );
          break;
        case "P2003":
          onFailure("categoryNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
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

async function deleteAuthorDraft(
  authorId: number,
  draftId: number,
  onSuccess: () => void,
  onFailure: (reason?: "draftNotFound") => void
): Promise<void> {
  try {
    const deletedDraft = await prisma.post.delete({
      where: {
        id: draftId,
        authorId,
        isDraft: true,
      },
    });
    deleteHostedImageFolder(deletedDraft.image);

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

export {
  getAuthorDrafts,
  updateAuthorDraft,
  publishAuthorDraft,
  deleteAuthorDraft,
};
