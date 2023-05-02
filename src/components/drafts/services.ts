import { type Post } from "@prisma/client";
import crypto from "crypto";

import prisma from "prisma";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "shared/images/utils";
import { type ValidatedPaginationQueryParameters } from "shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/pagination/utils";
import { includeSubcategories } from "components/categories/utils";

async function createDraft(
  {
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds,
  }: {
    image: string;
    extraImages: string[] | undefined;
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
    tagsIds: number[];
  },
  onSuccess: () => void
): Promise<void> {
  const draftImagesFolderName = `posts/${crypto.randomUUID()}`;

  await prisma.post.create({
    data: {
      image: saveImage(image, draftImagesFolderName, "main"),
      extraImages: extraImages
        ? {
            createMany: {
              data: extraImages.map((extraImage, index) => ({
                image: saveImage(
                  extraImage,
                  draftImagesFolderName,
                  `extra-${index}`
                ),
              })),
            },
          }
        : undefined,
      title,
      content,
      author: {
        connect: {
          id: authorId,
        },
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
      tags: {
        connect: tagsIds.map((tagId) => ({
          id: tagId,
        })),
      },
      isDraft: true,
    },
  });

  onSuccess();
}

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
      isDraft: true,
      author: {
        id: authorId,
      },
    },
    ...createPaginationParameters(validatedPaginationQueryParameters),
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
      isDraft: true,
      author: {
        id: authorId,
      },
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

async function updateDraftById(
  id: number,
  {
    image,
    extraImages,
    title,
    content,
    categoryId,
    tagsIds,
  }: {
    image?: string;
    extraImages?: string[];
    title?: string;
    content?: string;
    categoryId?: number;
    tagsIds?: number[];
  },
  onSuccess: () => void
): Promise<void> {
  const updatedDraft = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      categoryId,
      tags: tagsIds
        ? {
            set: [],
            connect: tagsIds.map((tagId) => ({
              id: tagId,
            })),
          }
        : undefined,
    },
  });

  if (image ?? extraImages) {
    const draftToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
      updatedDraft.image
    )}`;

    if (image) {
      saveImage(image, draftToUpdateImagesFolderName, "main");
    }

    if (extraImages) {
      const draftToUpdateExtraImages = await prisma.postExtraImage.findMany({
        where: {
          postId: id,
        },
      });

      for (const draftToUpdateExtraImage of draftToUpdateExtraImages) {
        const deletedPostToUpdateExtraImage =
          await prisma.postExtraImage.delete({
            where: {
              id: draftToUpdateExtraImage.id,
            },
          });

        deleteHostedImage(deletedPostToUpdateExtraImage.image);
      }

      await prisma.post.update({
        where: {
          id,
        },
        data: {
          extraImages: {
            createMany: {
              data: extraImages.map((extraImage, index) => ({
                image: saveImage(
                  extraImage,
                  draftToUpdateImagesFolderName,
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
}

async function publishAuthorDraft(
  draftId: number,
  authorId: number,
  onSuccess: () => void,
  onFailure: () => void
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
    console.log(error);

    onFailure();
  }
}

async function deleteAuthorDraftById(
  draftId: number,
  authorId: number,
  onSuccess: () => void,
  onFailure: () => void
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
    console.log(error);

    onFailure();
  }
}

export {
  createDraft,
  getAuthorDrafts,
  updateDraftById,
  publishAuthorDraft,
  deleteAuthorDraftById,
};
