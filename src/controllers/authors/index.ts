import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";

import { validateRequestBody } from "./utils";

async function createAuthor(req: Request, res: Response): Promise<void> {
  const { isValid, errors } = validateRequestBody(req.body);

  if (isValid) {
    try {
      await prisma.author.create({
        data: {
          description: req.body.description,
          userId: Number(req.body.userId),
        },
      });

      res.status(201).end();
    } catch (error) {
      console.log(error);

      res.status(500).end();
    }
  } else {
    res.status(400).json(errors);
  }
}

async function getAuthors(req: Request, res: Response): Promise<void> {
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        description: true,
      },
      skip,
      take,
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
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function updateAuthor(req: Request, res: Response): Promise<void> {
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

    res.status(500).end();
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

    res.status(500).end();
  }
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
