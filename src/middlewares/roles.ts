import { type Request, type Response, type NextFunction } from "express";

function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authenticatedUser?.isAdmin) {
    next();
  } else {
    res.status(404).end();
  }
}

export { isAdmin };
