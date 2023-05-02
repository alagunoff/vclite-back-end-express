import { type Request, type Response } from "express";

import prisma from "prisma";
import { validatePaginationQueryParameters } from "shared/pagination/utils";

import * as services from "./services";
import {
  validateCreationData,
  validateFilterQueryParameters,
  validateOrderQueryParameters,
  validateUpdateData,
} from "./utils";

async function createPost(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createPost(
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
  const postToUpdate = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
      isDraft: false,
    },
  });

  if (postToUpdate) {
    const updateDataValidationErrors = await validateUpdateData(req.body);

    if (updateDataValidationErrors) {
      res.status(400).json(updateDataValidationErrors);
    } else {
      void services.updatePostById(
        postToUpdate.id,
        {
          image: req.body.image,
          extraImages: req.body.extraImages,
          title: req.body.title,
          content: req.body.content,
          authorId: req.body.authorId,
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

async function deletePost(req: Request, res: Response): Promise<void> {
  void services.deletePostById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createPost, getPosts, updatePost, deletePost };
