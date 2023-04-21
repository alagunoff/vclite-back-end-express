import { type User, type Author } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    authenticatedUser?: User;
    authenticatedAuthor?: Author;
  }
}
