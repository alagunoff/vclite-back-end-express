import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData, validateUpdateData } from "./utils";

async function createTag(req: Request, res: Response): Promise<void> {
  const errors = await validateCreationData(req.body);

  if (errors) {
    res.status(400).json(errors);
  } else {
    await prisma.tag.create({
      data: {
        name: req.body.name,
      },
    });

    res.status(201).end();
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
  const errors = await validateUpdateData(req.body);

  if (errors) {
    res.status(400).json(errors);
  } else {
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

      res.status(404).send("Tag with this id wasn't found");
    }
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

    res.status(404).send("Tag with this id wasn't found");
  }
}

export { createTag, getTags, updateTag, deleteTag };
