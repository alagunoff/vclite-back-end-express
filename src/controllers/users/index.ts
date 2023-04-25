import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "prisma";
import { saveImage, deleteImage } from "shared/utils/images";

import { validateCreationData } from "./utils";

async function createUser(req: Request, res: Response): Promise<void> {
  const creationDataValidationErrors = await validateCreationData(req.body);

  if (creationDataValidationErrors) {
    res.status(400).json(creationDataValidationErrors);
  } else {
    const createdUser = await prisma.user.create({
      data: {
        image: saveImage(
          req.body.image,
          "static/images/users",
          req.body.username
        ),
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });

    res
      .status(201)
      .send(jwt.sign(String(createdUser.id), process.env.JWT_SECRET_KEY));
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
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    deleteImage(deletedUser.image);

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(404).send("User with this id wasn't found");
  }
}

export { createUser, getUser, deleteUser };
