import { type Request, type Response, type NextFunction } from "express";

function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);

  res.status(500).end();
}

export { handleError };
