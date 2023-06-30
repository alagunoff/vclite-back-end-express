import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { createUser } from "collections/users/controllers";
import * as services from "collections/users/services";
import * as validators from "collections/users/validators";
import { ApiError } from "shared/errors/classes";

jest.mock("collections/users/validators");
jest.mock("collections/users/services");

const { res: mockRes, mockClear } = getMockRes();
const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);

afterEach(() => {
  jest.restoreAllMocks();
  mockClear();
});

describe("createUser", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ image: "required" });
    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status 422 when there is user's creation error", async () => {
    mockServices.createUser.mockResolvedValue(new ApiError(422));
    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(422);
  });

  test("should set response status 201 when user has been created", async () => {
    await createUser(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});
