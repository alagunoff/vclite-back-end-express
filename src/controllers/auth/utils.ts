import { type Request } from "express";

function validateRequestBody(req: Request):
  | {
      isValid: true;
      errors: null;
    }
  | {
      isValid: false;
      errors: Record<string, unknown>;
    } {
  const errors: Record<string, unknown> = {};

  if (typeof req.body.username !== "string" || req.body.username === "") {
    errors.username = "we expect it to be not empty string";
  }

  if (typeof req.body.password !== "string" || req.body.password === "") {
    errors.password = "we expect it to be not empty string";
  }

  return Object.keys(errors).length
    ? { isValid: false, errors }
    : { isValid: true, errors: null };
}

export { validateRequestBody };
