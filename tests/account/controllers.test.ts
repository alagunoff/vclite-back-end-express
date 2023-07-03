import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { register, logIn } from "account/controllers";
import * as services from "account/services";
import * as validators from "account/validators";
import * as userServices from "collections/users/services";
import * as userValidators from "collections/users/validators";
import { ApiError } from "shared/errors/classes";

import { user } from "../mock-data";

jest.mock("account/validators");
jest.mock("account/services");
jest.mock("collections/users/validators");
jest.mock("collections/users/services");
jest.mock("shared/mailer");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);
const mockUserValidators = jest.mocked(userValidators);
const mockUserServices = jest.mocked(userServices);

describe("register", () => {
  test("should set response status 400 when there are registration data validation errors", async () => {
    mockUserValidators.validateCreationData.mockReturnValue({
      image: "required",
    });

    const { res: mockRes } = getMockRes();

    await register(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is user's creation error", async () => {
    const apiError = new ApiError(422);
    mockUserServices.createUser.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await register(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when account has been registered", async () => {
    mockUserServices.createUser.mockResolvedValue(user);

    const { res: mockRes } = getMockRes();

    await register(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("login", () => {
  test("should set response status 400 when there are login data validation errors", async () => {
    mockValidators.validateLoginData.mockReturnValue({
      username: "required",
    });

    const { res: mockRes } = getMockRes();

    await logIn(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is login error", async () => {
    const apiError = new ApiError(401);
    mockServices.logIn.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await logIn(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should respond with jwt when login was successful", async () => {
    const fakeJwt = "j.w.t";
    mockServices.logIn.mockResolvedValue(fakeJwt);

    const { res: mockRes } = getMockRes();

    await logIn(getMockReq(), mockRes);

    expect(mockRes.send).toBeCalledWith(fakeJwt);
  });
});
