import { type Request, type Response } from "express";

import prisma from "prisma";
import { type CategoryWithSubcategories } from "shared/types/categories";
import { includeSubcategories } from "shared/utils/categories";
import { createPaginationParameters } from "shared/utils/pagination";

async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.create({
      data: {
        category: req.body.category,
        parentCategoryId: Number(req.body.parentCategoryId) || undefined,
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const categories: CategoryWithSubcategories[] =
      await prisma.category.findMany({
        where: {
          parentCategoryId: null,
        },
        select: {
          id: true,
          category: true,
        },
        skip,
        take,
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
      pagesTotalNumber: Math.ceil(
        categoriesTotalNumber / categories.length ?? 1
      ),
    });
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        category: req.body.category,
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
