import { type Request, type Response } from "express";

import * as postServices from "collections/posts/services";
import {
  validateCreationData,
  validateUpdateData,
} from "collections/posts/validators";
import { createPaginationParameters } from "shared/pagination/utils";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

async function createDraft(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const draftCreationError = await postServices.createPost({
    ...req.body,
    authorId: req.authenticatedAuthor?.id,
    isDraft: true,
  });

  if (draftCreationError) {
    res.status(draftCreationError.code).send(draftCreationError.reason);
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
  } = await postServices.getPosts({
    where: {
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    ...createPaginationParameters(req.query),
  });

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

  const draftUpdateError = await postServices.updatePost(
    {
      id: Number(req.params.id),
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    req.body
  );

  if (draftUpdateError) {
    res.status(draftUpdateError.code);

    draftUpdateError.reason ? res.send(draftUpdateError.reason) : res.end();

    return;
  }

  res.status(204).end();
}

async function publishDraft(req: Request, res: Response) {
  const draftUpdateError = await postServices.updatePost(
    {
      id: Number(req.params.id),
      authorId: req.authenticatedAuthor?.id,
      isDraft: true,
    },
    { isDraft: false }
  );

  if (draftUpdateError) {
    res.status(draftUpdateError.code).end();
    return;
  }

  res.status(201).end();
}

async function deleteDraft(req: Request, res: Response) {
  const draftDeletionError = await postServices.deletePost({
    id: Number(req.params.id),
    authorId: req.authenticatedAuthor?.id,
    isDraft: true,
  });

  if (draftDeletionError) {
    res.status(draftDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createDraft, getDrafts, updateDraft, publishDraft, deleteDraft };
