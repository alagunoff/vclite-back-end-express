import { type Request, type Response } from "express";

import { validateCreationData } from "./validators";
import * as services from "./services";

async function createUser(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
    return;
  }

  const userCreationResult = await services.createUser(req.body);

  if (userCreationResult.status === "failure") {
    res.status(userCreationResult.errorCode).end();
    return;
  }

  res.status(201).send(userCreationResult.jwt);
}

function getUser(req: Request, res: Response): void {
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

async function deleteUser(req: Request, res: Response): Promise<void> {
  const userDeletionResult = await services.deleteUserById(
    Number(req.params.id)
  );

  if (userDeletionResult.status === "failure") {
    res.status(userDeletionResult.errorCode).end();
    return;
  }

  res.status(204).end();
}

export { createUser, getUser, deleteUser };
