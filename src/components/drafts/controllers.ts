import { type Request, type Response } from "express";

import prisma from "prisma";

import { validatePaginationQueryParameters } from "shared/pagination/utils";
import { validateCreationData } from "components/posts/utils";

import * as services from "./services";
import { validateUpdateData } from "./utils";

async function createDraft(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createDraft(
      {
        image: req.body.image,
        extraImages: req.body.extraImages,
        title: req.body.title,
        content: req.body.content,
        authorId: req.authenticatedAuthor?.id as number,
        categoryId: req.body.categoryId,
        tagsIds: req.body.tagsIds,
      },
      () => {
        res.status(201).end();
      }
    );
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
    void services.getAuthorDrafts(
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
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
  });

  if (draftToUpdate) {
    const updateDataValidationErrors = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updateDraftById(
        draftToUpdate.id,
        {
          image: req.body.image,
          extraImages: req.body.extraImages,
          title: req.body.title,
          content: req.body.content,
          categoryId: req.body.categoryId,
          tagsIds: req.body.tagsIds,
        },
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
  void services.deleteAuthorDraftById(
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
