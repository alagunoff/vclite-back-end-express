import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import { validateCreationData } from "./validators";

async function createComment(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = validateCreationData({
    ...req.body,
    postId: Number(req.params.postId),
  });

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createComment(
      validatedCreationData,
      () => {
        res.status(201).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "postNotFound":
            res.status(404).end();
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

async function getComments(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedPaginationQueryParameters,
    errors: paginationQueryParametersValidationErrors,
  } = validatePaginationQueryParameters(req.query);

  if (paginationQueryParametersValidationErrors) {
    res.status(400).json(paginationQueryParametersValidationErrors);
  } else {
    void services.getCommentsForPost(
      Number(req.params.postId),
      validatedPaginationQueryParameters,
      (comments, commentsTotalNumber, pagesTotalNumber) => {
        res.json({ comments, commentsTotalNumber, pagesTotalNumber });
      },
      (failureReason) => {
        switch (failureReason) {
          case "postNotFound":
            res.status(404).end();
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

async function deleteComments(req: Request, res: Response): Promise<void> {
  void services.deletePostComments(
    Number(req.params.postId),
    () => {
      res.status(204).end();
    },
    (failureReason) => {
      switch (failureReason) {
        case "postNotFound":
          res.status(404).end();
          break;
        default:
          res.status(500).end();
      }
    }
  );
}

export { createComment, getComments, deleteComments };
