import { type Request, type Response } from "express";

import { ApiError } from "shared/errors/classes";

import * as services from "./services";
import { validateCreationData } from "./validators";

async function createUser(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const userCreationResult = await services.createUser({
    image: req.body.image,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    verified: true,
  });

  if (userCreationResult instanceof ApiError) {
    res.status(userCreationResult.code).end();
    return;
  }

  res.status(201).end();
}

function getUser(req: Request, res: Response) {
  res.json({
    id: req.authenticatedUser?.id,
    image: req.authenticatedUser?.image,
    username: req.authenticatedUser?.username,
    firstName: req.authenticatedUser?.firstName,
    lastName: req.authenticatedUser?.lastName,
    createdAt: req.authenticatedUser?.createdAt,
  });
}

async function deleteUser(req: Request, res: Response) {
  const userDeletionError = await services.deleteUser({
    id: Number(req.params.id),
  });

  if (userDeletionError) {
    res.status(userDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createUser, getUser, deleteUser };
