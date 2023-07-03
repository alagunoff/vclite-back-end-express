import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { createUser, getUser, deleteUser } from "collections/users/controllers";
import * as services from "collections/users/services";
import * as validators from "collections/users/validators";
import { ApiError } from "shared/errors/classes";

import { verifiedUser } from "../mock-data";

jest.mock("collections/users/validators");
jest.mock("collections/users/services");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);

describe("createUser", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ image: "required" });

    const { res: mockRes } = getMockRes();

    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is user's creation error", async () => {
    const apiError = new ApiError(422);
    mockServices.createUser.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when user has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getUser", () => {
  test("should return authenticated user", () => {
    const { res: mockRes } = getMockRes();

    getUser(getMockReq({ authenticatedUser: verifiedUser }), mockRes);

    expect(mockRes.json).toBeCalledWith(
      expect.objectContaining({ id: verifiedUser.id })
    );
  });
});

describe("deleteUser", () => {
  test("should set response status to api error code when there is user's deletion error", async () => {
    const apiError = new ApiError(422);
    mockServices.deleteUser.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deleteUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when user has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deleteUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
