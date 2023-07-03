import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "collections/authors/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { verifiedUser, author } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));

const mockPrisma = jest.mocked(prisma);

describe("createAuthor", () => {
  const authorCreationData = { userId: 1 };

  test("should return error when user for which to create author not found", async () => {
    expect(await createAuthor(authorCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return nothing when authors's creation successful", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(verifiedUser);

    expect(await createAuthor(authorCreationData)).toBeUndefined();
  });
});

describe("getAuthors", () => {
  test("should return authors", async () => {
    const authors = await getAuthors({});

    expect(authors).toHaveProperty("authors");
  });
});

describe("updateAuthor", () => {
  test("should return error when author does not exist", async () => {
    expect(
      await updateAuthor({ id: -1 }, { description: "lala" })
    ).toBeInstanceOf(ApiError);
  });

  test("should return nothing when author's update successful", async () => {
    mockPrisma.author.findUnique.mockResolvedValue(author);

    expect(
      await updateAuthor({ id: 1 }, { description: "lala" })
    ).toBeUndefined();
  });
});

describe("deleteAuthor", () => {
  test("should return error when author does not exist", async () => {
    expect(await deleteAuthor({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when author's deletion successful", async () => {
    mockPrisma.author.findUnique.mockResolvedValue(author);

    expect(await deleteAuthor({ id: 1 })).toBeUndefined();
  });
});
