import { type Prisma } from "@prisma/client";
import crypto from "crypto";

import prisma from "src/shared/prisma";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "src/shared/images/utils";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";
import { includeSubcategories } from "src/resources/categories/utils";

async function createPost({
  image,
  extraImages,
  title,
  content,
  authorId,
  categoryId,
  tagsIds,
  isDraft,
}: {
  image: string;
  extraImages?: string[];
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  tagsIds: number[];
  isDraft: boolean;
}): Promise<
  { status: "success" } | { status: "failure"; errorCode: 422; message: string }
> {
  if (!(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    return {
      status: "failure",
      errorCode: 422,
      message: "category with this id not found",
    };
  }

  for (const tagId of tagsIds) {
    if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
      return {
        status: "failure",
        errorCode: 422,
        message: `tag with id ${tagId} not found`,
      };
    }
  }

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
      authorId,
      categoryId,
      tags: { connect: tagsIds.map((tagId) => ({ id: tagId })) },
      isDraft,
    },
  });

  return { status: "success" };
}

async function getPosts(
  filterParameters: Prisma.PostWhereInput,
  paginationParameters: PaginationParameters,
  orderParameters?: Prisma.PostOrderByWithRelationInput
) {
  const posts = await prisma.post.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: orderParameters ?? { id: "asc" },
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

  return {
    posts,
    postsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      postsTotalNumber,
      paginationParameters.take
    ),
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
    tagsIds,
    isDraft,
  }: {
    image?: string;
    extraImages?: string[];
    title?: string;
    content?: string;
    categoryId?: number;
    tagsIds?: number[];
    isDraft?: boolean;
  }
): Promise<
  | { status: "success" }
  | { status: "failure"; errorCode: 404 }
  | { status: "failure"; errorCode: 422; message: string }
> {
  if (!(await prisma.post.findUnique({ where: filterParameters }))) {
    return {
      status: "failure",
      errorCode: 404,
    };
  }

  if (
    categoryId &&
    !(await prisma.category.findUnique({ where: { id: categoryId } }))
  ) {
    return {
      status: "failure",
      errorCode: 422,
      message: "category with this id not found",
    };
  }

  if (tagsIds) {
    for (const tagId of tagsIds) {
      if (!(await prisma.tag.findUnique({ where: { id: tagId } }))) {
        return {
          status: "failure",
          errorCode: 422,
          message: `tag with id ${tagId} not found`,
        };
      }
    }
  }

  const updatedPost = await prisma.post.update({
    where: filterParameters,
    data: {
      title,
      content,
      categoryId,
      tags: tagsIds
        ? { set: tagsIds.map((tagId) => ({ id: tagId })) }
        : undefined,
      isDraft,
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

  return { status: "success" };
}

async function deletePost(
  filterParameters: Prisma.PostWhereUniqueInput
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.post.findUnique({ where: filterParameters }))) {
    return { status: "failure", errorCode: 404 };
  }

  const deletedPost = await prisma.post.delete({ where: filterParameters });
  deleteHostedImageFolder(deletedPost.image);

  return { status: "success" };
}

export { createPost, getPosts, updatePost, deletePost };
