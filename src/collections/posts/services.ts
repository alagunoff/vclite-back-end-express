import { type Prisma } from "@prisma/client";
import crypto from "node:crypto";

import { includeSubcategories } from "collections/categories/utils";
import { ApiError } from "shared/errors/classes";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "shared/images/utils";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

async function createPost(creationData: {
  image: string;
  extraImages?: string[];
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  tagIds: number[];
  isDraft: boolean;
}) {
  if (
    !(await prisma.category.findUnique({
      where: { id: creationData.categoryId },
    }))
  ) {
    return new ApiError(422, "categoryNotFound");
  }

  for (const tagId of creationData.tagIds) {
    if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
      return new ApiError(422, `tag with id ${tagId} not found`);
    }
  }

  const postImagesFolderName = `posts/${crypto.randomUUID()}`;

  await prisma.post.create({
    data: {
      image: await saveImage(creationData.image, postImagesFolderName, "main"),
      extraImages: creationData.extraImages
        ? {
            createMany: {
              data: await Promise.all(
                creationData.extraImages.map(async (extraImage, index) => ({
                  image: await saveImage(
                    extraImage,
                    postImagesFolderName,
                    `extra-${index}`
                  ),
                }))
              ),
            },
          }
        : undefined,
      title: creationData.title,
      content: creationData.content,
      authorId: creationData.authorId,
      categoryId: creationData.categoryId,
      tags: { connect: creationData.tagIds.map((tagId) => ({ id: tagId })) },
      isDraft: creationData.isDraft,
    },
  });
}

async function getPosts({
  where,
  skip,
  take,
  orderBy,
}: Prisma.PostFindManyArgs) {
  const posts = await prisma.post.findMany({
    where,
    skip,
    take,
    orderBy: orderBy ?? DEFAULT_ORDER_PARAMETERS,
    select: {
      id: true,
      image: true,
      extraImages: { select: { id: true, image: true } },
      title: true,
      content: true,
      author: { select: { id: true, description: true } },
      category: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
      comments: { select: { id: true, content: true } },
      createdAt: true,
    },
  });
  const postsTotalNumber = await prisma.post.count({ where });

  for (const post of posts) {
    await includeSubcategories(post.category);
  }

  return {
    posts,
    postsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(postsTotalNumber, take),
  };
}

async function updatePost(
  filterParameters: Prisma.PostUpdateArgs["where"],
  updateData: {
    image?: string;
    extraImages?: string[];
    title?: string;
    content?: string;
    categoryId?: number;
    tagIds?: number[];
    isDraft?: boolean;
  }
) {
  if (!(await prisma.post.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  if (
    updateData.categoryId &&
    !(await prisma.category.findUnique({
      where: { id: updateData.categoryId },
    }))
  ) {
    return new ApiError(422, "categoryNotFound");
  }

  if (updateData.tagIds) {
    for (const tagId of updateData.tagIds) {
      if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
        return new ApiError(422, `tag with id ${tagId} not found`);
      }
    }
  }

  const updatedPost = await prisma.post.update({
    where: filterParameters,
    data: {
      title: updateData.title,
      content: updateData.content,
      categoryId: updateData.categoryId,
      tags: updateData.tagIds
        ? { set: updateData.tagIds.map((tagId) => ({ id: tagId })) }
        : undefined,
      isDraft: updateData.isDraft,
    },
  });

  if (updateData.image ?? updateData.extraImages) {
    const updatedPostImagesFolderName = `posts/${getHostedImageFolderName(
      updatedPost.image
    )}`;

    if (updateData.image) {
      await saveImage(updateData.image, updatedPostImagesFolderName, "main");
    }

    if (updateData.extraImages) {
      const updatedPostExtraImages = await prisma.postExtraImage.findMany({
        where: { postId: updatedPost.id },
      });

      for (const extraImage of updatedPostExtraImages) {
        const deletedExtraImage = await prisma.postExtraImage.delete({
          where: { id: extraImage.id },
        });

        await deleteHostedImage(deletedExtraImage.image);
      }

      await prisma.post.update({
        where: { id: updatedPost.id },
        data: {
          extraImages: {
            createMany: {
              data: await Promise.all(
                updateData.extraImages.map(async (extraImage, index) => ({
                  image: await saveImage(
                    extraImage,
                    updatedPostImagesFolderName,
                    `extra-${index}`
                  ),
                }))
              ),
            },
          },
        },
      });
    }
  }
}

async function deletePost(filterParameters: Prisma.PostDeleteArgs["where"]) {
  if (!(await prisma.post.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  const deletedPost = await prisma.post.delete({ where: filterParameters });
  await deleteHostedImageFolder(deletedPost.image);
}

export { createPost, getPosts, updatePost, deletePost };
