import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "collections/posts/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { category, tag, post } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));
jest.mock("shared/images/utils");
jest.mock("collections/categories/utils");

const mockPrisma = jest.mocked(prisma);

describe("createPost", () => {
  const postCreationData = {
    image:
      "data:image/webp;base64,UklGRtYCAABXRUJQVlA4WAoAAAAgAAAAMQAAMQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg6AAAADAGAJ0BKjIAMgA+bTaYSCQjIqEmFViggA2JaQATgA52T+38oPzYLkKDYvZ+YQjQhnmE24WFgUp1awAA/vcIv3wfv8PUfyFBm48ObyaFq2Avp/c1T68+hG/zrYM+C/HD+Ck21PolFmZZbk4BKoeV6itYywvIeX+tq+f9dR1JzOcEddBsvP4/HVr/tKZet6XKHdA6C1p6QcZMod706wjeeu0vEHo9aG/j9R0Gypy4+YOYQouHu89pevCmRJbob+Gvp2F/zcXoB7kV9f2w7bswa9P+aLyWe+5/kGzgVsK5oHqE2w87RBSAAAA=",
    title: "title",
    content: "content",
    authorId: 1,
    categoryId: 1,
    tagIds: [1],
    isDraft: false,
  };

  test("should return error when category does not exist", async () => {
    expect(await createPost(postCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return error when some tag does not exist", async () => {
    mockPrisma.category.findUnique.mockResolvedValue(category);

    expect(await createPost(postCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return nothing when post's creation successful", async () => {
    mockPrisma.category.findUnique.mockResolvedValue(category);
    mockPrisma.tag.findUnique.mockResolvedValue(tag);

    expect(await createPost(postCreationData)).toBeUndefined();
  });
});

describe("getPosts", () => {
  test("should return posts", async () => {
    mockPrisma.post.findMany.mockResolvedValue([post]);
    const posts = await getPosts({});

    expect(posts).toHaveProperty("posts");
  });
});

describe("updatePost", () => {
  test("should return error when post does not exist", async () => {
    expect(await updatePost({ id: -1 }, {})).toBeInstanceOf(ApiError);
  });

  test("should return nothing when post's update successful", async () => {
    mockPrisma.post.findUnique.mockResolvedValue(post);

    expect(await updatePost({ id: 1 }, {})).toBeUndefined();
  });
});

describe("deletePost", () => {
  test("should return error when post does not exist", async () => {
    expect(await deletePost({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when post's deletion successful", async () => {
    mockPrisma.post.findUnique.mockResolvedValue(post);
    mockPrisma.post.delete.mockResolvedValue(post);

    expect(await deletePost({ id: 1 })).toBeUndefined();
  });
});
