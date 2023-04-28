import { type Request, type Response } from "express";
import crypto from "crypto";

import prisma from "prisma";
import {
  saveImage,
  getHostedImageFolderName,
  deleteHostedImage,
  deleteHostedImageFolder,
} from "shared/utils/images";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { includeSubcategories } from "shared/utils/categories";

import {
  validateCreationData,
  validateGetRequest,
  createFilterParameters,
  createOrderParameters,
  validateUpdateData,
} from "./utils";

async function createPost(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    const postImagesFolderName = `posts/${crypto.randomUUID()}`;

    await prisma.post.create({
      data: {
        image: saveImage(req.body.image, postImagesFolderName, "main"),
        extraImages:
          "extraImages" in req.body
            ? {
                createMany: {
                  data: req.body.extraImages.map(
                    (extraImage: string, index: number) => ({
                      image: saveImage(
                        extraImage,
                        postImagesFolderName,
                        `extra-${index}`
                      ),
                    })
                  ),
                },
              }
            : undefined,
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
        tags: {
          connect: req.body.tagsIds.map((tagId: number) => ({
            id: tagId,
          })),
        },
      },
    });

    res.status(201).end();
  }
}

async function getPosts(req: Request, res: Response): Promise<void> {
  const getRequestValidationErrors = validateGetRequest(req.query);

  if (getRequestValidationErrors) {
    res.status(400).json(getRequestValidationErrors);
  } else {
    const posts = await prisma.post.findMany({
      where: createFilterParameters(req.query),
      ...createPaginationParameters(req.query),
      orderBy: createOrderParameters(req.query),
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
  const postToUpdate = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
      isDraft: false,
    },
  });

  if (postToUpdate) {
    const updateDataValidationErrors = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      await prisma.post.update({
        where: {
          id: postToUpdate.id,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
          authorId: req.body.authorId,
          categoryId: req.body.categoryId,
          tags:
            "tagsIds" in req.body
              ? {
                  set: [],
                  connect: req.body.tagsIds.map((tagId: number) => ({
                    id: tagId,
                  })),
                }
              : undefined,
        },
      });

      if ("image" in req.body || "extraImages" in req.body) {
        const postToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
          postToUpdate.image
        )}`;

        if ("image" in req.body) {
          saveImage(req.body.image, postToUpdateImagesFolderName, "main");
        }

        if ("extraImages" in req.body) {
          const postExtraImages = await prisma.postExtraImage.findMany({
            where: {
              postId: postToUpdate.id,
            },
          });

          for (const postExtraImage of postExtraImages) {
            deleteHostedImage(postExtraImage.image);
          }

          await prisma.postExtraImage.deleteMany({
            where: {
              postId: postToUpdate.id,
            },
          });
          await prisma.post.update({
            where: {
              id: postToUpdate.id,
            },
            data: {
              extraImages: {
                createMany: {
                  data: req.body.extraImages.map(
                    (extraImage: string, index: number) => ({
                      image: saveImage(
                        extraImage,
                        postToUpdateImagesFolderName,
                        `extra-${index}`
                      ),
                    })
                  ),
                },
              },
            },
          });
        }
      }

      res.status(204).end();
    }
  } else {
    res.status(404).end();
  }
}

async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(req.params.id),
        isDraft: false,
      },
    });
    deleteHostedImageFolder(deletedPost.image);

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).end();
  }
}

export { createPost, getPosts, updatePost, deletePost };
