import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

import prisma from "prisma";

function authenticateUser(responseStatus = 401) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.slice(7);

      try {
        const authenticatedUser = await prisma.user.findUnique({
          where: {
            id: Number(jwt.verify(token, process.env.JWT_SECRET_KEY)),
          },
        });

        if (authenticatedUser) {
          req.authenticatedUser = authenticatedUser;

          next();
        } else {
          res.status(responseStatus).end();
        }
      } catch (error) {
        console.log(error);

        res.status(responseStatus).end();
      }
    } else {
      res
        .status(responseStatus)
        .send(
          'You must provide "Authorization" header in the form "Bearer *jwt token*"'
        );
    }
  };
}

async function authenticateAuthor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authenticatedAuthor = await prisma.author.findUnique({
    where: {
      userId: req.authenticatedUser?.id,
    },
  });

  if (authenticatedAuthor) {
    req.authenticatedAuthor = authenticatedAuthor;

    next();
  } else {
    res.status(403).send("Only authors have access");
  }
}

export { authenticateUser, authenticateAuthor };
