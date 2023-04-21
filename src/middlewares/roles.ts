import { type Request, type Response, type NextFunction } from "express";

import prisma from "prisma";

function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authenticatedUser?.isAdmin) {
    next();
  } else {
    res.status(404).end();
  }
}

async function isAuthor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (
    await prisma.author.findUnique({
      where: {
        userId: req.authenticatedUser?.id,
      },
    })
  ) {
    next();
  } else {
    res.status(403).send("Only authors can access this endpoint");
  }
}

export { isAdmin, isAuthor };
