import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  saveImageToStaticFiles,
  deleteImageFolderFromStaticFiles,
} from "shared/utils/images";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { transformStringToLowercasedKebabString } from "shared/utils/strings";
import { includeSubcategories } from "shared/utils/categories";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { createFilterParameters, createOrderParameters } from "./utils";

async function createPost(req: Request, res: Response): Promise<void> {
  try {
    await prisma.post.create({
      data: {
        imageUrl:
          req.body.image &&
          saveImageToStaticFiles(
            req.body.image,
            `posts/${transformStringToLowercasedKebabString(req.body.title)}`,
            "main"
          ),
        title: req.body.title,
        content: req.body.content,
        author: {
          connect: {
            id: req.authenticatedAuthor?.id,
          },
        },
        category: {
          connect: {
            id: req.body.categoryId,
          },
        },
        tags: req.body.tagsIds && {
          connect: req.body.tagsIds.map((tagId: number) => ({
            id: tagId,
          })),
        },
        extraImages: req.body.extraImages && {
          createMany: {
            data: req.body.extraImages.map(
              (extraImage: string, index: number) => ({
                url: saveImageToStaticFiles(
                  extraImage,
                  `posts/${transformStringToLowercasedKebabString(
                    req.body.title
                  )}`,
                  `extra-${index}`
                ),
              })
            ),
          },
        },
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getPosts(req: Request, res: Response): Promise<void> {
  const errors = validatePaginationQueryParameters(req.query);

  if (errors) {
    res.status(400).json(errors);
  } else {
    const posts = await prisma.post.findMany({
      where: createFilterParameters(req),
      ...createPaginationParameters(req.query),
      orderBy: createOrderParameters(req),
      select: {
        id: true,
        imageUrl: true,
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
        extraImages: {
          select: {
            id: true,
            url: true,
          },
        },
        createdAt: true,
      },
    });
    for (const post of posts) {
      await includeSubcategories(post.category);
    }

    const postsTotalNumber = await prisma.post.count({
      where: {
        isDraft: false,
      },
    });

    res.json({
      posts,
      postsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        postsTotalNumber,
        posts.length
      ),
    });
  }
}

async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    await prisma.post.update({
      where: {
        id_isDraft: {
          id: Number(req.params.id),
          isDraft: false,
        },
      },
      data: {
        imageUrl:
          req.body.image &&
          saveImageToStaticFiles(
            req.body.image,
            `posts/${transformStringToLowercasedKebabString(req.body.title)}`,
            "main"
          ),
        title: req.body.title,
        content: req.body.content,
        authorId: req.body.authorId,
        categoryId: req.body.categoryId,
        tags: req.body.tagsIds && {
          connect: req.body.tagsIds.map((tagId: number) => ({
            id: tagId,
          })),
        },
        extraImages: req.body.extraImages && {
          createMany: {
            data: req.body.extraImages.map(
              (extraImage: string, index: number) => ({
                url: saveImageToStaticFiles(
                  extraImage,
                  `posts/${transformStringToLowercasedKebabString(
                    req.body.title
                  )}`,
                  `extra-${index}`
                ),
              })
            ),
          },
        },
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id_isDraft: {
          id: Number(req.params.id),
          isDraft: false,
        },
      },
    });

    res.status(204).end();
    deleteImageFolderFromStaticFiles(deletedPost.imageUrl);
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

export { createPost, getPosts, updatePost, deletePost };
