import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "prisma";

import { validateRequestBody } from "./utils";

async function login(req: Request, res: Response): Promise<void> {
  const { isValid, errors } = validateRequestBody(req);

  if (isValid) {
    try {
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
          res.status(400).send("Password is incorrect");
        }
      } else {
        res.status(404).send("We didn't find a username with this username");
      }
    } catch (error) {
      console.log(error);

      res.status(500).end();
    }
  } else {
    res.status(400).json(errors);
  }
}

export { login };
