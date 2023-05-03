import { type Request, type Response } from "express";

import prisma from "shared/prisma";

import { validatePaginationQueryParameters } from "shared/pagination/utils";
import {
  validateCreationData,
  validateUpdateData,
} from "components/posts/validators";

import * as services from "./services";

async function createDraft(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = await validateCreationData({
    ...req.body,
    authorId: req.authenticatedAuthor?.id,
  });

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createDraft(validatedCreationData, () => {
      res.status(201).end();
    });
  }
}

async function getDrafts(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedPaginationQueryParameters,
    errors: paginationQueryParametersValidationErrors,
  } = validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
  } else {
    void services.getDraftsByAuthorId(
      req.authenticatedAuthor?.id as number,
      validatedPaginationQueryParameters,
      (drafts, draftsTotalNumber, pagesTotalNumber) => {
        res.json({ drafts, draftsTotalNumber, pagesTotalNumber });
      }
    );
  }
}

async function updateDraft(req: Request, res: Response): Promise<void> {
  const draftToUpdate = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
      isDraft: true,
      authorId: req.authenticatedAuthor?.id,
    },
  });

  if (draftToUpdate) {
    const {
      validatedData: validatedUpdateData,
      errors: updateDataValidationErrors,
    } = await validateUpdateData(req.body, false);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updateDraftById(
        draftToUpdate.id,
        validatedUpdateData,
        () => {
          res.status(204).end();
        }
      );
    }
  } else {
    res.status(404).end();
  }
}

async function publishDraft(req: Request, res: Response): Promise<void> {
  void services.publishAuthorDraft(
    Number(req.params.id),
    req.authenticatedAuthor?.id as number,
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

async function deleteDraft(req: Request, res: Response): Promise<void> {
  void services.deleteAuthorDraft(
    Number(req.params.id),
    req.authenticatedAuthor?.id as number,
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createDraft, getDrafts, updateDraft, publishDraft, deleteDraft };
