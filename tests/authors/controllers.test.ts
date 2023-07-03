import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "collections/authors/controllers";
import * as services from "collections/authors/services";
import * as validators from "collections/authors/validators";
import { ApiError } from "shared/errors/classes";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

jest.mock("collections/authors/validators");
jest.mock("collections/authors/services");
jest.mock("shared/pagination/validator");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);
const mockPaginationQueryParametersValidator = jest.mocked(
  validatePaginationQueryParameters
);

describe("createAuthor", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ userId: "required" });

    const { res: mockRes } = getMockRes();

    await createAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is author's creation error", async () => {
    const apiError = new ApiError(422);
    mockServices.createAuthor.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when author has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getAuthors", () => {
  test("should set response status 400 when there are pagination query parameters validation errors", async () => {
    mockPaginationQueryParametersValidator.mockReturnValue({
      pageNumber: "required",
    });

    const { res: mockRes } = getMockRes();

    await getAuthors(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should call json method on response when there are no errors", async () => {
    const { res: mockRes } = getMockRes();

    await getAuthors(getMockReq(), mockRes);

    expect(mockRes.json).toBeCalled();
  });
});

describe("updateAuthor", () => {
  test("should set response status 400 when there are update data validation errors", async () => {
    mockValidators.validateUpdateData.mockReturnValue({
      description: "required",
    });

    const { res: mockRes } = getMockRes();

    await updateAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is author's update error", async () => {
    const apiError = new ApiError(422);
    mockServices.updateAuthor.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await updateAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when author has been updated", async () => {
    const { res: mockRes } = getMockRes();

    await updateAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});

describe("deleteAuthor", () => {
  test("should set response status to api error code when there is author's deletion error", async () => {
    const apiError = new ApiError(422);
    mockServices.deleteAuthor.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deleteAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when author has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deleteAuthor(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
