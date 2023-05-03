import { type Request, type Response } from "express";

import prisma from "prisma";
import { validatePaginationQueryParameters } from "shared/pagination/utils";

import * as services from "./services";
import { validateCreationData, validateUpdateData } from "./utils";

async function createTag(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createTag(validatedCreationData, () => {
      res.status(201).end();
    });
  }
}

async function getTags(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedPaginationQueryParameters,
    errors: paginationQueryParametersValidationErrors,
  } = validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
  } else {
    void services.getTags(
      validatedPaginationQueryParameters,
      (tags, tagsTotalNumber, pagesTotalNumber) => {
        res.json({ tags, tagsTotalNumber, pagesTotalNumber });
      }
    );
  }
}

async function updateTag(req: Request, res: Response): Promise<void> {
  const tagToUpdate = await prisma.tag.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (tagToUpdate) {
    const {
      validatedData: validatedUpdateData,
      errors: updateDataValidationErrors,
    } = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updateTagById(tagToUpdate.id, validatedUpdateData, () => {
        res.status(204).end();
      });
    }
  } else {
    res.status(404).end();
  }
}

async function deleteTag(req: Request, res: Response): Promise<void> {
  void services.deleteTagById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createTag, getTags, updateTag, deleteTag };
