import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { validatePaginationQueryParameters } from "shared/utils/validation";

import { validateCreationData, validateUpdateData } from "./utils";

async function createTag(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
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
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res
      .status(400)
      .json({ queryParameters: paginationQueryParametersValidationErrors });
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
  const tagToUpdate = await prisma.tag.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (tagToUpdate) {
    const updateDataValidationErrors = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      await prisma.tag.update({
        where: {
          id: tagToUpdate.id,
        },
        data: {
          name: req.body.name,
        },
      });

      res.status(204).end();
    }
  } else {
    res.status(404).end();
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

    res.status(404).end();
  }
}

export { createTag, getTags, updateTag, deleteTag };
