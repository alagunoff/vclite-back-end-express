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
            id: Number(jwt.verify(token, process.env.JWT_SECRET_KEY) as string),
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
      res.status(responseStatus).end();
    }
  };
}

function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authenticatedUser?.isAdmin) {
    next();
  } else {
    res.status(404).end();
  }
}

export { authenticateUser, isAdmin };
