import { type Request, type Response } from "express";

import validatePaginationQueryParameters from "src/shared/pagination/validator";
import { createPaginationParameters } from "src/shared/pagination/utils";
import {
  validateCreationData,
  validateUpdateData,
} from "src/resources/posts/validators";
import * as postServices from "src/resources/posts/services";

async function createDraft(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const draftCreationResult = await postServices.createPost({
    ...req.body,
    authorId: req.authenticatedAuthor?.id,
    isDraft: true,
  });

  if (draftCreationResult.status === "failure") {
    res.status(draftCreationResult.errorCode).send(draftCreationResult.message);
    return;
  }

  res.status(201).end();
}

async function getDrafts(req: Request, res: Response) {
  const paginationQueryParametersValidationErrors =
    validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
    return;
  }

  const {
    posts: drafts,
    postsTotalNumber: draftsTotalNumber,
    pagesTotalNumber,
  } = await postServices.getPosts(
    {
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    createPaginationParameters(req.query)
  );

  res.json({
    drafts,
    draftsTotalNumber,
    pagesTotalNumber,
  });
}

async function updateDraft(req: Request, res: Response) {
  const updateDataValidationErrors = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
    return;
  }

  const draftUpdateResult = await postServices.updatePost(
    {
      id: Number(req.params.id),
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    req.body
  );

  if (draftUpdateResult.status === "failure") {
    res.status(draftUpdateResult.errorCode);

    draftUpdateResult.errorCode === 404
      ? res.end()
      : res.send(draftUpdateResult.message);

    return;
  }

  res.status(204).end();
}

async function publishDraft(req: Request, res: Response) {
  const draftUpdateResult = await postServices.updatePost(
    {
      id: Number(req.params.id),
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    { isDraft: false }
  );

  if (draftUpdateResult.status === "failure") {
    res.status(draftUpdateResult.errorCode).end();
    return;
  }

  res.status(201).end();
}

async function deleteDraft(req: Request, res: Response) {
  const draftDeletionResult = await postServices.deletePost({
    id: Number(req.params.id),
    authorId: req.authenticatedAuthor?.id,
    isDraft: true,
  });

  if (draftDeletionResult.status === "failure") {
    res.status(draftDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createDraft, getDrafts, updateDraft, publishDraft, deleteDraft };
