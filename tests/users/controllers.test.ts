import { jest, describe, test, expect, afterEach } from "@jest/globals";

import { createUser } from "collections/users/controllers";
import * as services from "collections/users/services";
import * as validators from "collections/users/validators";
import { ApiError } from "shared/errors/classes";

jest.mock("collections/users/validators");
jest.mock("collections/users/services");

const mockReq: any = {};
const mockRes: any = {};
mockRes.json = jest.fn(() => mockRes);
mockRes.end = jest.fn(() => mockRes);
mockRes.status = jest.fn(() => mockRes);
const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);

afterEach(() => {
  jest.restoreAllMocks();
  mockRes.json.mockRestore();
  mockRes.end.mockRestore();
  mockRes.status.mockRestore();
});

describe("createUser", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ image: "required" });
    await createUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status 422 when there is user's creation error", async () => {
    mockServices.createUser.mockResolvedValue(new ApiError(422));
    await createUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(422);
  });

  test("should set response status 201 when user has been created", async () => {
    await createUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});
