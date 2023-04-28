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
import { validatePaginationQueryParameters } from "shared/utils/validation";
import {
  validateCreationData,
  validateUpdateData,
} from "controllers/posts/utils";

async function createDraft(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    const draftImagesFolderName = `posts/${crypto.randomUUID()}`;

    await prisma.post.create({
      data: {
        image: saveImage(req.body.image, draftImagesFolderName, "main"),
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
        extraImages:
          "extraImages" in req.body
            ? {
                createMany: {
                  data: req.body.extraImages.map(
                    (extraImage: string, index: number) => ({
                      image: saveImage(
                        extraImage,
                        draftImagesFolderName,
                        `extra-${index}`
                      ),
                    })
                  ),
                },
              }
            : undefined,
        isDraft: true,
      },
    });

    res.status(201).end();
  }
}

async function getDrafts(req: Request, res: Response): Promise<void> {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res
      .status(400)
      .json({ queryParameters: paginationQueryParametersValidationErrors });
  } else {
    const drafts = await prisma.post.findMany({
      where: {
        isDraft: true,
        author: {
          id: req.authenticatedAuthor?.id,
        },
      },
      ...createPaginationParameters(req.query),
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
    for (const draft of drafts) {
      await includeSubcategories(draft.category);
    }

    const draftsTotalNumber = await prisma.post.count({
      where: {
        isDraft: true,
        author: {
          id: req.authenticatedAuthor?.id,
        },
      },
    });

    res.json({
      drafts,
      draftsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        draftsTotalNumber,
        drafts.length
      ),
    });
  }
}

async function updateDraft(req: Request, res: Response): Promise<void> {
  const draftToUpdate = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
      isDraft: true,
      authorId: req.authenticatedAuthor?.id,
    },
  });

  if (draftToUpdate) {
    const updateDataValidationErrors = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      await prisma.post.update({
        where: {
          id: draftToUpdate.id,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
          authorId: req.body.authorId,
          categoryId: req.body.categoryId,
          tags:
            "tagsIds" in req.body
              ? {
                  connect: req.body.tagsIds.map((tagId: number) => ({
                    id: tagId,
                  })),
                }
              : undefined,
        },
      });

      if ("image" in req.body || "extraImages" in req.body) {
        const draftToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
          draftToUpdate.image
        )}`;

        if ("image" in req.body) {
          saveImage(req.body.image, draftToUpdateImagesFolderName, "main");
        }

        if ("extraImages" in req.body) {
          const draftExtraImages = await prisma.postExtraImage.findMany({
            where: {
              postId: draftToUpdate.id,
            },
          });

          for (const draftExtraImage of draftExtraImages) {
            deleteHostedImage(draftExtraImage.image);
          }

          await prisma.postExtraImage.deleteMany({
            where: {
              postId: draftToUpdate.id,
            },
          });
          await prisma.post.update({
            where: {
              id: draftToUpdate.id,
            },
            data: {
              extraImages: {
                createMany: {
                  data: req.body.extraImages.map(
                    (extraImage: string, index: number) => ({
                      image: saveImage(
                        extraImage,
                        draftToUpdateImagesFolderName,
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

async function publishDraft(req: Request, res: Response): Promise<void> {
  try {
    await prisma.post.update({
      where: {
        id: Number(req.params.id),
        isDraft: true,
        authorId: req.authenticatedAuthor?.id,
      },
      data: {
        isDraft: false,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).end();
  }
}

async function deleteDraft(req: Request, res: Response): Promise<void> {
  try {
    const deletedDraft = await prisma.post.delete({
      where: {
        id: Number(req.params.id),
        isDraft: true,
        authorId: req.authenticatedAuthor?.id,
      },
    });
    deleteHostedImageFolder(deletedDraft.image);

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).end();
  }
}

export { createDraft, getDrafts, updateDraft, publishDraft, deleteDraft };
