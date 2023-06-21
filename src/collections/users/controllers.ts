import { type Request, type Response } from "express";

import * as services from "./services";
import { validateCreationData } from "./validators";

async function createUser(req: Request, res: Response) {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const userCreationError = await services.createUser(req.body);

  if (userCreationError) {
    res.status(userCreationError.code).end();
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
    isAdmin: req.authenticatedUser?.isAdmin,
    createdAt: req.authenticatedUser?.createdAt,
  });
}

async function deleteUser(req: Request, res: Response) {
  const userDeletionError = await services.deleteUserById(
    Number(req.params.id)
  );

  if (userDeletionError) {
    res.status(userDeletionError.code).end();
    return;
  }

  res.status(204).end();
}

export { createUser, getUser, deleteUser };
