import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "prisma";

import { validateLoginData } from "./utils";

async function login(req: Request, res: Response): Promise<void> {
  const validationErrors = await validateLoginData(req.body);

  if (validationErrors) {
    res.status(400).json(validationErrors);
  } else {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      const isProvidedPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (isProvidedPasswordCorrect) {
        const userJwtToken = jwt.sign(
          String(user.id),
          process.env.JWT_SECRET_KEY
        );

        res.send(userJwtToken);
      } else {
        res.status(403).end();
      }
    }
  }
}

export { login };
