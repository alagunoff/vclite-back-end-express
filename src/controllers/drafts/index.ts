import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  saveImage,
  deleteFolder,
  deleteImageFolder,
  getHostedImageFolderName,
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
    const draftImagesSavePath = `static/images/posts/${crypto.randomUUID()}`;

    await prisma.post.create({
      data: {
        imageUrl: saveImage(req.body.image, draftImagesSavePath, "main"),
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
                      url: saveImage(
                        extraImage,
                        `${draftImagesSavePath}/extra`,
                        String(index)
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
  const updateDataValidationErrors = await validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    try {
      const updatedDraft = await prisma.post.update({
        where: {
          id: Number(req.params.id),
          isDraft: true,
          authorId: req.authenticatedAuthor?.id,
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
        const updatedDraftImagesFolderName = getHostedImageFolderName(
          updatedDraft.imageUrl
        );

        if ("image" in req.body) {
          saveImage(
            req.body.image,
            `static/images/posts/${updatedDraftImagesFolderName}`,
            "main"
          );
        }

        if ("extraImages" in req.body) {
          await prisma.postExtraImage.deleteMany({
            where: {
              postId: updatedDraft.id,
            },
          });
          deleteFolder(
            `static/images/posts/${updatedDraftImagesFolderName}/extra`
          );
          await prisma.post.update({
            where: {
              id: updatedDraft.id,
            },
            data: {
              extraImages: {
                createMany: {
                  data: req.body.extraImages.map(
                    (extraImage: string, index: number) => ({
                      url: saveImage(
                        extraImage,
                        `static/images/posts/${updatedDraftImagesFolderName}/extra`,
                        String(index)
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
    } catch (error) {
      console.log(error);

      res.status(404).send("Draft with this id wasn't found");
    }
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

    res.status(404).send("Draft with this id wasn't found");
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
    deleteImageFolder(deletedDraft.imageUrl);

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).send("Draft with this id wasn't found");
  }
}

export { createDraft, getDrafts, updateDraft, publishDraft, deleteDraft };
