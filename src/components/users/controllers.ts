import { type Request, type Response } from "express";

import * as services from "./services";

import { validateCreationData } from "./validators";

function createUser(req: Request, res: Response): void {
  const {
    validatedData: validatedCreationData,
    errors: creationDataValidationErrors,
  } = validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    void services.createUser(
      validatedCreationData,
      (userJwtToken) => {
        res.status(201).send(userJwtToken);
      },
      () => {
        res.status(422).end();
      }
    );
  }
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

function deleteUser(req: Request, res: Response): void {
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
