import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

import prisma from "prisma";

function authenticateUser(onlyAdmin?: true) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.slice(7);

      try {
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const authenticatedUser = await prisma.user.findUnique({
          where: {
            id: Number(decodedJwt),
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
          if (onlyAdmin) {
            res.status(404).end();
          } else {
            res
              .status(401)
              .send("It seems that user with this token has been deleted");
          }
        }
      } catch (error) {
        console.log(error);

        if (onlyAdmin) {
          res.status(404).end();
        } else {
          res.status(401).send("Token is invalid");
        }
      }
    } else {
      if (onlyAdmin) {
        res.status(404).end();
      } else {
        res
          .status(401)
          .send(
            'You must provide "Authorization" header in the form "Bearer *jwt*"'
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
