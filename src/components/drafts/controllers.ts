import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";

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

async function publishDraft(req: Request, res: Response): Promise<void> {
  void services.publishAuthorDraft(
    req.authenticatedAuthor?.id as number,
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    (failureReason) => {
      switch (failureReason) {
        case "draftNotFound":
          res.status(404).end();
          break;
        default:
          res.status(500).end();
      }
    }
  );
}

export { getDrafts, publishDraft };
