import { type Request, type Response } from "express";

import * as services from "./services";

import { validateCreationData } from "./validators";

async function createUser(req: Request, res: Response): Promise<void> {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createUser(validatedCreationData, (userJwtToken) => {
      res.status(201).send(userJwtToken);
    });
  }
}

async function getUser(req: Request, res: Response): Promise<void> {
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
  void services.deleteUserById(
    Number(req.params.id),
    () => {
      res.status(204).end();
    },
    () => {
      res.status(404).end();
    }
  );
}

export { createUser, getUser, deleteUser };
