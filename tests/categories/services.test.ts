import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "collections/categories/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { category } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));
jest.mock("collections/categories/utils");

const mockPrisma = jest.mocked(prisma);

describe("createCategory", () => {
  const categoryCreationData = { name: "category" };

  test("should return error when category already exists", async () => {
    mockPrisma.category.findUnique.mockResolvedValue(category);

    expect(await createCategory(categoryCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return nothing when category's creation successful", async () => {
    expect(await createCategory(categoryCreationData)).toBeUndefined();
  });
});

describe("getCategories", () => {
  test("should return categories", async () => {
    mockPrisma.category.findMany.mockResolvedValue([category]);
    const categories = await getCategories({});

    expect(categories).toHaveProperty("categories");
  });
});

describe("updateCategory", () => {
  test("should return error when category does not exist", async () => {
    expect(await updateCategory({ id: -1 }, { name: "lala" })).toBeInstanceOf(
      ApiError
    );
  });

  test("should return nothing when category's update successful", async () => {
    mockPrisma.category.findUnique.mockResolvedValue(category);

    expect(await updateCategory({ id: 1 }, {})).toBeUndefined();
  });
});

describe("deleteCategory", () => {
  test("should return error when category does not exist", async () => {
    expect(await deleteCategory({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when category's deletion successful", async () => {
    mockPrisma.category.findUnique.mockResolvedValue(category);

    expect(await deleteCategory({ id: 1 })).toBeUndefined();
  });
});
