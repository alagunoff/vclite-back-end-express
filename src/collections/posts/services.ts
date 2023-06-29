import { type Prisma } from "@prisma/client";
import crypto from "node:crypto";

import { includeSubcategories } from "collections/categories/utils";
import { prisma } from "shared/database/prisma";
import { ApiError } from "shared/errors/classes";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "shared/images/utils";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { calculatePagesTotalNumber } from "shared/pagination/utils";

async function createPost({
  image,
  extraImages,
  title,
  content,
  authorId,
  categoryId,
  tagIds,
  isDraft,
}: {
  image: string;
  extraImages?: string[];
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  tagIds: number[];
  isDraft: boolean;
}) {
  if (!(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    return new ApiError(422, "categoryNotFound");
  }

  for (const tagId of tagIds) {
    if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
      return new ApiError(422, `tag with id ${tagId} not found`);
    }
  }

  const postImagesFolderName = `posts/${crypto.randomUUID()}`;

  await prisma.post.create({
    data: {
      image: await saveImage(image, postImagesFolderName, "main"),
      extraImages: extraImages
        ? {
            createMany: {
              data: await Promise.all(
                extraImages.map(async (extraImage, index) => ({
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
      title,
      content,
      authorId,
      categoryId,
      tags: { connect: tagIds.map((tagId) => ({ id: tagId })) },
      isDraft,
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
  filterParameters: Prisma.PostWhereUniqueInput,
  {
    image,
    extraImages,
    title,
    content,
    categoryId,
    tagIds,
    isDraft,
  }: {
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
    categoryId &&
    !(await prisma.category.findUnique({ where: { id: categoryId } }))
  ) {
    return new ApiError(422, "categoryNotFound");
  }

  if (tagIds) {
    for (const tagId of tagIds) {
      if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
        return new ApiError(422, `tag with id ${tagId} not found`);
      }
    }
  }

  const updatedPost = await prisma.post.update({
    where: filterParameters,
    data: {
      title,
      content,
      categoryId,
      tags: tagIds
        ? { set: tagIds.map((tagId) => ({ id: tagId })) }
        : undefined,
      isDraft,
    },
  });

  if (image ?? extraImages) {
    const updatedPostImagesFolderName = `posts/${getHostedImageFolderName(
      updatedPost.image
    )}`;

    if (image) {
      await saveImage(image, updatedPostImagesFolderName, "main");
    }

    if (extraImages) {
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
                extraImages.map(async (extraImage, index) => ({
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

async function deletePost(filterParameters: Prisma.PostWhereUniqueInput) {
  if (!(await prisma.post.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  const deletedPost = await prisma.post.delete({ where: filterParameters });
  await deleteHostedImageFolder(deletedPost.image);
}

export { createPost, getPosts, updatePost, deletePost };
