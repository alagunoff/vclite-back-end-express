import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import {
  createComment,
  getComments,
  deleteComments,
} from "collections/comments/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { post } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));

const mockPrisma = jest.mocked(prisma);

describe("createComment", () => {
  const commentCreationData = { content: "content", postId: 1 };

  test("should return error when post does not exist", async () => {
    expect(await createComment(commentCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return nothing when comment's creation successful", async () => {
    mockPrisma.post.findUnique.mockResolvedValue(post);

    expect(await createComment(commentCreationData)).toBeUndefined();
  });
});

describe("getComments", () => {
  test("should return comments", async () => {
    const comments = await getComments({}, {});

    expect(comments).toHaveProperty("comments");
  });
});

describe("deleteComments", () => {
  test("should return nothing when comments' deletion successful", async () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(await deleteComments({ id: 1 })).toBeUndefined();
  });
});
