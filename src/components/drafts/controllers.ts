import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";
import { validateUpdateData } from "src/components/posts/validators";

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

async function updateDraft(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedUpdateData,
    errors: updateDataValidationErrors,
  } = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    void services.updateAuthorDraft(
      req.authenticatedAuthor?.id as number,
      Number(req.params.id),
      validatedUpdateData,
      () => {
        res.status(204).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "draftNotFound":
            res.status(404).end();
            break;
          case "categoryNotFound":
            res.status(422).send("category with this id not found");
            break;
          case "someTagNotFound":
            res
              .status(422)
              .send("some tag in provided array of tags ids not found");
            break;
          default:
            res.status(500).end();
        }
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

async function deleteDraft(req: Request, res: Response): Promise<void> {
  void services.deleteAuthorDraft(
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

export { getDrafts, updateDraft, publishDraft, deleteDraft };
