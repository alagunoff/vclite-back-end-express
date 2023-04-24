import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData, validateUpdateData } from "./utils";

async function createAuthor(req: Request, res: Response): Promise<void> {
  const errors = await validateCreationData(req.body);

  if (errors) {
    res.status(400).json(errors);
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
  const errors = validatePaginationQueryParameters(req.query);

  if (errors) {
    res.status(400).json({ queryParameters: errors });
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
  const errors = validateUpdateData(req.body);

  if (errors) {
    res.status(400).json(errors);
  } else {
    try {
      await prisma.author.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          description: req.body.description,
        },
      });

      res.status(204).end();
    } catch (error) {
      console.log(error);

      res.status(404).send("Author with this id wasn't found");
    }
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

    res.status(404).send("Author with this id wasn't found");
  }
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
