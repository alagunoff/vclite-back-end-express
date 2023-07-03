import { jest, describe, test, expect } from "@jest/globals";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import jsonwebtoken from "jsonwebtoken";

import { logIn } from "account/services";
import { ApiError } from "shared/errors/classes";
import { prisma } from "shared/prisma";

import { unverifiedUser, verifiedUser, jwt } from "../mock-data";

jest.mock("jsonwebtoken");
jest.mock("shared/prisma", () => ({ prisma: mockDeep<PrismaClient>() }));

const mockJsonwebtoken = jest.mocked(jsonwebtoken);
const mockPrisma = jest.mocked(prisma);

describe("logIn", () => {
  const loginData = { username: "oleg", password: "oleg" };

  test("should return error when user to log in not found", async () => {
    expect(await logIn(loginData)).toBeInstanceOf(ApiError);
  });

  test("should return error when user is unverified", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(unverifiedUser);

    expect(await logIn(loginData)).toBeInstanceOf(ApiError);
  });

  test("should return jwt when user's login successful", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(verifiedUser);
    mockJsonwebtoken.sign.mockReturnValue(jwt as any);

    expect(await logIn(loginData)).toBe(jwt);
  });
});
