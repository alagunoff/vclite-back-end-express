import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

async function createTag(req: Request, res: Response): Promise<void> {
  try {
    await prisma.tag.create({
      data: {
        name: req.body.name,
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getTags(req: Request, res: Response): Promise<void> {
  const errors = validatePaginationQueryParameters(req.query);

  if (errors) {
    res.status(400).json(errors);
  } else {
    const tags = await prisma.tag.findMany({
      ...createPaginationParameters(req.query),
    });
    const tagsTotalNumber = await prisma.tag.count();

    res.json({
      tags,
      tagsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(tagsTotalNumber, tags.length),
    });
  }
}

async function updateTag(req: Request, res: Response): Promise<void> {
  try {
    await prisma.tag.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteTag(req: Request, res: Response): Promise<void> {
  try {
    await prisma.tag.delete({
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

export { createTag, getTags, updateTag, deleteTag };
