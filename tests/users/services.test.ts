import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";

import { createUser, updateUser, deleteUser } from "collections/users/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { user } from "../mock-data";

jest.mock("shared/prisma", () => ({ prisma: mockDeep() }));
jest.mock("shared/images/utils");

const mockPrisma = jest.mocked(prisma);

afterEach(() => {
  jest.restoreAllMocks();
});

describe("createUser", () => {
  const userCreationData = {
    image:
      "data:image/webp;base64,UklGRtYCAABXRUJQVlA4WAoAAAAgAAAAMQAAMQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg6AAAADAGAJ0BKjIAMgA+bTaYSCQjIqEmFViggA2JaQATgA52T+38oPzYLkKDYvZ+YQjQhnmE24WFgUp1awAA/vcIv3wfv8PUfyFBm48ObyaFq2Avp/c1T68+hG/zrYM+C/HD+Ck21PolFmZZbk4BKoeV6itYywvIeX+tq+f9dR1JzOcEddBsvP4/HVr/tKZet6XKHdA6C1p6QcZMod706wjeeu0vEHo9aG/j9R0Gypy4+YOYQouHu89pevCmRJbob+Gvp2F/zcXoB7kV9f2w7bswa9P+aLyWe+5/kGzgVsK5oHqE2w87RBSAAAA=",
    username: "oleg",
    password: "oleg",
    email: "oleg@ol.eg",
    verified: false,
  };

  test("should return error when user with this username/email already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);

    expect(await createUser(userCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return created user", async () => {
    mockPrisma.user.create.mockResolvedValue(user);

    expect(await createUser(userCreationData)).toBe(user);
  });
});

describe("updateUser", () => {
  test("should return error when user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    expect(await updateUser({ id: -1 }, { verified: true })).toBeInstanceOf(
      ApiError
    );
  });

  test("should return nothing when user's update successful", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);

    expect(await updateUser({ id: 1 }, { verified: true })).toBeUndefined();
  });
});

describe("deleteUser", () => {
  test("should return error when user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    expect(await deleteUser({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should return nothing when user's deletion successfu", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.delete.mockResolvedValue(user);

    expect(await deleteUser({ id: 1 })).toBeUndefined();
  });
});
