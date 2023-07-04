import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "collections/tags/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { tag } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));

const mockPrisma = jest.mocked(prisma);

describe("createTag", () => {
  const tagCreationData = { name: "tag" };

  test("should return error when tag already exists", async () => {
    mockPrisma.tag.findUnique.mockResolvedValue(tag);

    expect(await createTag(tagCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return nothing when tag's creation successful", async () => {
    expect(await createTag(tagCreationData)).toBeUndefined();
  });
});

describe("getTags", () => {
  test("should return tags", async () => {
    const tags = await getTags({});

    expect(tags).toHaveProperty("tags");
  });
});

describe("updateTag", () => {
  test("should return error when tag does not exist", async () => {
    expect(await updateTag({ id: -1 }, { name: "lala" })).toBeInstanceOf(
      ApiError
    );
  });

  test("should return nothing when tag's update successful", async () => {
    mockPrisma.tag.findUnique.mockResolvedValue(tag);

    expect(await updateTag({ id: 1 }, {})).toBeUndefined();
  });
});

describe("deleteTag", () => {
  test("should return error when tag does not exist", async () => {
    expect(await deleteTag({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when tag's deletion successful", async () => {
    mockPrisma.tag.findUnique.mockResolvedValue(tag);

    expect(await deleteTag({ id: 1 })).toBeUndefined();
  });
});
