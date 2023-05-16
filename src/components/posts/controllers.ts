import { type Request, type Response } from "express";

import { validatePaginationQueryParameters } from "src/shared/pagination/utils";

import * as services from "./services";
import {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
} from "./validators";

function createPost(asDraft = false) {
  return async function (req: Request, res: Response) {
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors,
    } = validateCreationData({
      ...req.body,
      authorId: req.authenticatedAuthor?.id,
      isDraft: asDraft,
    });

    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void services.createPost(
        validatedCreationData,
        () => {
          res.status(201).end();
        },
        (failureReason) => {
          switch (failureReason) {
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
  };
}

async function getPosts(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedFilterQueryParameters,
    errors: filterQueryParametersValidationErrors,
  } = validateFilterQueryParameters(req.query);

  if (filterQueryParametersValidationErrors) {
    res.status(400).json(filterQueryParametersValidationErrors);
  } else {
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors,
    } = validatePaginationQueryParameters(req.query);

    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      const {
        validatedData: validatedOrderQueryParameters,
        errors: orderQueryParametersValidationErrors,
      } = validateOrderQueryParameters(req.query);

      if (orderQueryParametersValidationErrors) {
        res.status(400).json(orderQueryParametersValidationErrors);
      } else {
        void services.getPosts(
          validatedFilterQueryParameters,
          validatedPaginationQueryParameters,
          validatedOrderQueryParameters,
          (posts, postsTotalNumber, pagesTotalNumber) => {
            res.json({ posts, postsTotalNumber, pagesTotalNumber });
          }
        );
      }
    }
  }
}

async function updatePost(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedUpdateData,
    errors: updateDataValidationErrors,
  } = validateUpdateData(req.body);

  if (updateDataValidationErrors) {
    res.status(400).json(updateDataValidationErrors);
  } else {
    void services.updatePostById(
      Number(req.params.id),
      validatedUpdateData,
      () => {
        res.status(204).end();
      },
      (failureReason) => {
        switch (failureReason) {
          case "postNotFound":
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

async function deletePost(req: Request, res: Response): Promise<void> {
  void services.deletePostById(
    Number(req.params.id),
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

export { createPost, getPosts, updatePost, deletePost };
