import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "shared/env";
import { prisma } from "shared/prisma";

function authenticateUser(as?: "admin" | "author") {
  const isAdminAuthentication = as === "admin";

  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      res.status(isAdminAuthentication ? 404 : 401).end();
      return;
    }

    const encodedJwt = req.headers.authorization.slice(7);
    jwt.verify(encodedJwt, env.JWT_SECRET_KEY, async (error, decodedJwt) => {
      if (error) {
        res.status(isAdminAuthentication ? 404 : 401).end();
        return;
      }

      const authenticatedUser = await prisma.user.findUnique({
        where: { id: Number(decodedJwt) },
      });

      if (!authenticatedUser) {
        res.status(isAdminAuthentication ? 404 : 401).end();
        return;
      }

      req.authenticatedUser = authenticatedUser;

      if (isAdminAuthentication && !authenticatedUser.isAdmin) {
        res.status(404).end();
        return;
      }

      if (as === "author") {
        const authenticatedAuthor = await prisma.author.findUnique({
          where: { userId: authenticatedUser.id },
        });

        if (!authenticatedAuthor) {
          res.status(403).end();
          return;
        }

        req.authenticatedAuthor = authenticatedAuthor;
      }

      next();
    });
  };
}

export { authenticateUser };
