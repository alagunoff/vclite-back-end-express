import { type Request, type Response, type NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

import { env } from "shared/env";
import { prisma } from "shared/prisma";
import { checkIfValueIsPositiveInteger } from "shared/validation/validators";

function authenticateUser(as?: "admin" | "author") {
  const isAdminAuthentication = as === "admin";

  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      res.status(isAdminAuthentication ? 404 : 401).end();
      return;
    }

    jsonwebtoken.verify(
      req.headers.authorization.slice(7),
      env.JWT_SECRET_KEY,
      async (error, decodedPayload) => {
        if (
          error ??
          (typeof decodedPayload !== "object" ||
            !checkIfValueIsPositiveInteger(decodedPayload.data))
        ) {
          res.status(isAdminAuthentication ? 404 : 401).end();
          return;
        }

        const authenticatedUser = await prisma.user.findUnique({
          where: { id: decodedPayload.data },
        });

        if (!authenticatedUser?.verified) {
          res.status(isAdminAuthentication ? 404 : 401).end();
          return;
        }

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

        req.authenticatedUser = authenticatedUser;
        next();
      }
    );
  };
}

export { authenticateUser };
