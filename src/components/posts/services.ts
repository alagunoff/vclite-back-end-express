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
  }: ValidatedCreationData,
  onSuccess: () => void
): Promise<void> {
  const postImagesFolderName = `posts/${crypto.randomUUID()}`;

  await prisma.post.create({
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
    },
  });

  onSuccess();
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

async function updatePostById(
  id: number,
  {
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds,
  }: ValidatedUpdateData,
  onSuccess: () => void
): Promise<void> {
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      authorId,
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
    const postToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
      updatedPost.image
    )}`;

    if (image) {
      saveImage(image, postToUpdateImagesFolderName, "main");
    }

    if (extraImages) {
      const postToUpdateExtraImages = await prisma.postExtraImage.findMany({
        where: {
          postId: id,
        },
      });

      for (const postToUpdateExtraImage of postToUpdateExtraImages) {
        const deletedPostToUpdateExtraImage =
          await prisma.postExtraImage.delete({
            where: {
              id: postToUpdateExtraImage.id,
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
                  postToUpdateImagesFolderName,
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

async function deletePostById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id,
        isDraft: false,
      },
    });
    deleteHostedImageFolder(deletedPost.image);

    onSuccess();
  } catch (error) {
    console.log(error);

    onFailure();
  }
}

export { createPost, getPosts, updatePostById, deletePostById };
