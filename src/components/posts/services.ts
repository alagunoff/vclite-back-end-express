import { Prisma, type Post } from "@prisma/client";
import crypto from "crypto";

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
import { includeSubcategories } from "src/components/categories/utils";

import {
  type ValidatedCreationData,
  type ValidatedUpdateData,
  type ValidatedFilterQueryParameters,
  type ValidatedOrderQueryParameters,
} from "./types";
import { createFilterParameters, createOrderParameters } from "./utils";

async function createPost(
  {
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds,
    isDraft,
  }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: (reason?: "categoryNotFound" | "someTagNotFound") => void
): Promise<void> {
  try {
    const createdPost = await prisma.post.create({
      data: {
        image: "",
        title,
        content,
        authorId,
        categoryId,
        tags: {
          connect: tagsIds.map((tagId) => ({ id: tagId })),
        },
        isDraft,
      },
    });
    const postImagesFolderName = `posts/${crypto.randomUUID()}`;

    await prisma.post.update({
      where: { id: createdPost.id },
      data: {
        image: saveImage(image, postImagesFolderName, "main"),
        extraImages: extraImages
          ? {
              createMany: {
                data: extraImages.map((extraImage, index) => ({
                  image: saveImage(
                    extraImage,
                    postImagesFolderName,
                    `extra-${index}`
                  ),
                })),
              },
            }
          : undefined,
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2003":
          onFailure("categoryNotFound");
          break;
        case "P2025":
          onFailure("someTagNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function getPosts(
  validatedFilterQueryParameters: ValidatedFilterQueryParameters,
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  validatedOrderQueryParameters: ValidatedOrderQueryParameters,
  onSuccess: (
    posts: Array<Omit<Post, "authorId" | "categoryId" | "isDraft">>,
    postsTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const filterParameters = createFilterParameters(
    validatedFilterQueryParameters
  );
  const posts = await prisma.post.findMany({
    where: filterParameters,
    ...createPaginationParameters(validatedPaginationQueryParameters),
    orderBy: createOrderParameters(validatedOrderQueryParameters),
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
  const postsTotalNumber = await prisma.post.count({
    where: filterParameters,
  });

  for (const post of posts) {
    await includeSubcategories(post.category);
  }

  onSuccess(
    posts,
    postsTotalNumber,
    calculatePagesTotalNumber(postsTotalNumber, posts.length)
  );
}

async function updatePost(
  filterParameters: Prisma.PostWhereUniqueInput,
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
    reason?: "postNotFound" | "categoryNotFound" | "someTagNotFound"
  ) => void
): Promise<void> {
  try {
    const updatedPost = await prisma.post.update({
      where: filterParameters,
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
      const updatedPostImagesFolderName = `posts/${getHostedImageFolderName(
        updatedPost.image
      )}`;

      if (image) {
        saveImage(image, updatedPostImagesFolderName, "main");
      }

      if (extraImages) {
        const updatedPostExtraImages = await prisma.postExtraImage.findMany({
          where: {
            postId: updatedPost.id,
          },
        });

        for (const extraImage of updatedPostExtraImages) {
          const deletedExtraImage = await prisma.postExtraImage.delete({
            where: {
              id: extraImage.id,
            },
          });

          deleteHostedImage(deletedExtraImage.image);
        }

        await prisma.post.update({
          where: {
            id: updatedPost.id,
          },
          data: {
            extraImages: {
              createMany: {
                data: extraImages.map((extraImage, index) => ({
                  image: saveImage(
                    extraImage,
                    updatedPostImagesFolderName,
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
              ? "postNotFound"
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

async function deletePost(
  filterParameters: Prisma.PostWhereUniqueInput,
  onSuccess: () => void,
  onFailure: (reason?: "postNotFound") => void
): Promise<void> {
  try {
    const deletedPost = await prisma.post.delete({
      where: filterParameters,
    });
    deleteHostedImageFolder(deletedPost.image);

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("postNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { createPost, getPosts, updatePost, deletePost };
