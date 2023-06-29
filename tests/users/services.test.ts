import { type PrismaClient } from "@prisma/client";
import { vi, afterEach, describe, test, expect } from "vitest";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

import { createUser, updateUser, deleteUser } from "collections/users/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { user } from "../mock-data";

const mockedPrisma = prisma as DeepMockProxy<PrismaClient>;

vi.mock("shared/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));
vi.mock("shared/images/utils");

afterEach(() => {
  vi.restoreAllMocks();
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

  test("should return error", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user);

    expect(await createUser(userCreationData)).toBeInstanceOf(ApiError);
  });

  test("should return created user", async () => {
    mockedPrisma.user.create.mockResolvedValue(user);

    expect(await createUser(userCreationData)).not.toBeInstanceOf(ApiError);
  });
});

describe("updateUser", () => {
  test("should return error", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    expect(await updateUser({ id: -1 }, { verified: true })).toBeInstanceOf(
      ApiError
    );
  });

  test("should update the user", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user);

    expect(await updateUser({ id: 1 }, { verified: true })).not.toBeInstanceOf(
      ApiError
    );
  });
});

describe("deleteUser", () => {
  test("should return error", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    expect(await deleteUser({ id: -1 })).toBeInstanceOf(ApiError);
  });

  test("should delete the user", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user);
    mockedPrisma.user.delete.mockResolvedValue(user);

    expect(await deleteUser({ id: 1 })).not.toBeInstanceOf(ApiError);
  });
});
