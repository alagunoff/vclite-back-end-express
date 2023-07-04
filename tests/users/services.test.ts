import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { createUser, updateUser, deleteUser } from "collections/users/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { verifiedUser } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));
jest.mock("shared/images/utils");

const mockPrisma = jest.mocked(prisma);

describe("createUser", () => {
  const userCreationData = {
    image:
      "data:image/webp;base64,UklGRtYCAABXRUJQVlA4WAoAAAAgAAAAMQAAMQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg6AAAADAGAJ0BKjIAMgA+bTaYSCQjIqEmFViggA2JaQATgA52T+38oPzYLkKDYvZ+YQjQhnmE24WFgUp1awAA/vcIv3wfv8PUfyFBm48ObyaFq2Avp/c1T68+hG/zrYM+C/HD+Ck21PolFmZZbk4BKoeV6itYywvIeX+tq+f9dR1JzOcEddBsvP4/HVr/tKZet6XKHdA6C1p6QcZMod706wjeeu0vEHo9aG/j9R0Gypy4+YOYQouHu89pevCmRJbob+Gvp2F/zcXoB7kV9f2w7bswa9P+aLyWe+5/kGzgVsK5oHqE2w87RBSAAAA=",
    username: "oleg",
    password: "oleg",
    email: "oleg@ol.eg",
    verified: false,
  };

  test("should return error when user already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(verifiedUser);

    expect(await createUser(userCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return created user", async () => {
    mockPrisma.user.create.mockResolvedValue(verifiedUser);

    expect(await createUser(userCreationData)).toBe(verifiedUser);
  });
});

describe("updateUser", () => {
  test("should return error when user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    expect(await updateUser({ id: -1 }, {})).toBeInstanceOf(ApiError);
  });

  test("should return nothing when user's update successful", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(verifiedUser);

    expect(await updateUser({ id: 1 }, {})).toBeUndefined();
  });
});

describe("deleteUser", () => {
  test("should return error when user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    expect(await deleteUser({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when user's deletion successful", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(verifiedUser);
    mockPrisma.user.delete.mockResolvedValue(verifiedUser);

    expect(await deleteUser({ id: 1 })).toBeUndefined();
  });
});
