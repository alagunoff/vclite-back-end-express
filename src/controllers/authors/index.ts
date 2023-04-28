import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData, validateUpdateData } from "./utils";

async function createAuthor(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    await prisma.author.create({
      data: {
        description: req.body.description,
        userId: req.body.userId,
      },
    });

    res.status(201).end();
  }
}

async function getAuthors(req: Request, res: Response): Promise<void> {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res
      .status(400)
      .json({ queryParameters: paginationQueryParametersValidationErrors });
  } else {
    const authors = await prisma.author.findMany({
      ...createPaginationParameters(req.query),
      select: {
        id: true,
        description: true,
      },
    });
    const authorsTotalNumber = await prisma.author.count();

    res.json({
      authors,
      authorsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        authorsTotalNumber,
        authors.length
      ),
    });
  }
}

async function updateAuthor(req: Request, res: Response): Promise<void> {
  const authorToUpdate = await prisma.author.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (authorToUpdate) {
    const updateDataValidationErrors = validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      await prisma.author.update({
        where: {
          id: authorToUpdate.id,
        },
        data: {
          description: req.body.description,
        },
      });

      res.status(204).end();
    }
  } else {
    res.status(404).end();
  }
}

async function deleteAuthor(req: Request, res: Response): Promise<void> {
  try {
    await prisma.author.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).end();
  }
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
