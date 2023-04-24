import { type Request, type Response } from "express";

import prisma from "prisma";
import { includeSubcategories } from "shared/utils/categories";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.create({
      data: {
        name: req.body.name,
        parentCategory: {
          connect: req.body.parentCategoryId && {
            id: Number(req.body.parentCategoryId),
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

async function getCategories(req: Request, res: Response): Promise<void> {
  const errors = validatePaginationQueryParameters(req.query);

  if (errors) {
    res.status(400).json(errors);
  } else {
    const categories = await prisma.category.findMany({
      where: {
        parentCategoryId: null,
      },
      ...createPaginationParameters(req.query),
      select: {
        id: true,
        name: true,
      },
    });
    for (const category of categories) {
      await includeSubcategories(category);
    }

    const categoriesTotalNumber = await prisma.category.count({
      where: {
        parentCategoryId: null,
      },
    });

    res.json({
      categories,
      categoriesTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        categoriesTotalNumber,
        categories.length
      ),
    });
  }
}

async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        parentCategoryId: Number(req.body.parentCategoryId) || undefined,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

export { createCategory, getCategories, updateCategory, deleteCategory };
