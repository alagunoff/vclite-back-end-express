import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import { validateCreationData, validateUpdateData } from "./validators";
import * as services from "./services";

function createTag(req: Request, res: Response): void {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createTag(
      validatedCreationData,
      () => {
        res.status(201).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "tagAlreadyExists":
            res.status(422).send("tag with this name already exists");
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

function getTags(req: Request, res: Response): void {
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

function updateTag(req: Request, res: Response): void {
  const {
    validatedData: validatedUpdateData,
    errors: updateDataValidationErrors,
  } = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    void services.updateTagById(
      Number(req.params.id),
      validatedUpdateData,
      () => {
        res.status(204).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "tagNotFound":
            res.status(404).end();
            break;
          case "tagAlreadyExists":
            res.status(422).end();
            break;
          default:
            res.status(500).end();
        }
      }
    );
  }
}

function deleteTag(req: Request, res: Response): void {
  void services.deleteTagById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    (failureReason) => {
      switch (failureReason) {
        case "tagNotFound":
          res.status(404).end();
          break;
        default:
          res.status(500).end();
      }
    }
  );
}

export { createTag, getTags, updateTag, deleteTag };
