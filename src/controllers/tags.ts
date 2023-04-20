import { type Request, type Response } from "express";

import prisma from "prisma";
import { createPaginationParameters } from "shared/utils/pagination";

async function createTag(req: Request, res: Response): Promise<void> {
  try {
    await prisma.tag.create({
      data: {
        tag: req.body.tag,
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getTags(req: Request, res: Response): Promise<void> {
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const tags = await prisma.tag.findMany({
      skip,
      take,
    });
    const tagsTotalNumber = await prisma.tag.count();

    res.json({
      tags,
      tagsTotalNumber,
      pagesTotalNumber: Math.ceil(tagsTotalNumber / tags.length ?? 1),
    });
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function updateTag(req: Request, res: Response): Promise<void> {
  try {
    await prisma.tag.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        tag: req.body.tag,
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
