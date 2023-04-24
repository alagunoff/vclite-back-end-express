import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

import prisma from "prisma";

function authenticateUser(onlyAdmin?: true) {
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
          if (onlyAdmin) {
            if (authenticatedUser.isAdmin) {
              req.authenticatedUser = authenticatedUser;

              next();
            } else {
              res.status(404).end();
            }
          } else {
            req.authenticatedUser = authenticatedUser;

            next();
          }
        } else {
          res.status(onlyAdmin ? 404 : 401).end();
        }
      } catch (error) {
        console.log(error);

        res.status(onlyAdmin ? 404 : 401).end();
      }
    } else {
      if (onlyAdmin) {
        res.status(404).end();
      } else {
        res
          .status(401)
          .send(
            'You must provide "Authorization" header in the form "Bearer *token*"'
          );
      }
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
