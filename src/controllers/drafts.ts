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

async function createDraft(req: Request, res: Response): Promise<void> {
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
        isDraft: true,
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getDrafts(req: Request, res: Response): Promise<void> {
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const drafts = await prisma.post.findMany({
      where: {
        isDraft: true,
        author: {
          user: {
            id: req.authenticatedUser?.id,
          },
        },
      },
      skip,
      take,
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
          user: {
            id: req.authenticatedUser?.id,
          },
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
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function updateDraft(req: Request, res: Response): Promise<void> {
  try {
    await prisma.post.update({
      where: {
        id_isDraft: {
          id: Number(req.params.id),
          isDraft: true,
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
        isDraft: req.body.isDraft,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteDraft(req: Request, res: Response): Promise<void> {
  try {
    const deletedDraft = await prisma.post.delete({
      where: {
        id_isDraft: {
          id: Number(req.params.id),
          isDraft: true,
        },
      },
    });

    res.status(204).end();
    deleteImageFolderFromStaticFiles(deletedDraft.imageUrl);
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

export { createDraft, getDrafts, updateDraft, deleteDraft };
