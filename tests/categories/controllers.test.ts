import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "collections/categories/controllers";
import * as services from "collections/categories/services";
import * as validators from "collections/categories/validators";
import { ApiError } from "shared/errors/classes";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

jest.mock("collections/categories/validators");
jest.mock("collections/categories/services");
jest.mock("shared/pagination/validator");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);
const mockPaginationQueryParametersValidator = jest.mocked(
  validatePaginationQueryParameters
);

describe("createCategory", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ name: "required" });

    const { res: mockRes } = getMockRes();

    await createCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is category's creation error", async () => {
    const apiError = new ApiError(422);
    mockServices.createCategory.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when category has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getCategories", () => {
  test("should set response status 400 when there are pagination query parameters validation errors", async () => {
    mockPaginationQueryParametersValidator.mockReturnValue({
      pageNumber: "required",
    });

    const { res: mockRes } = getMockRes();

    await getCategories(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should call json method on response when there are no errors", async () => {
    const { res: mockRes } = getMockRes();

    await getCategories(getMockReq(), mockRes);

    expect(mockRes.json).toBeCalled();
  });
});

describe("updateCategory", () => {
  test("should set response status 400 when there are update data validation errors", async () => {
    mockValidators.validateUpdateData.mockReturnValue({
      name: "required",
    });

    const { res: mockRes } = getMockRes();

    await updateCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is category's update error", async () => {
    const apiError = new ApiError(422);
    mockServices.updateCategory.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await updateCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when category has been updated", async () => {
    const { res: mockRes } = getMockRes();

    await updateCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});

describe("deleteCategory", () => {
  test("should set response status to api error code when there is category's deletion error", async () => {
    const apiError = new ApiError(422);
    mockServices.deleteCategory.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deleteCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when category has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deleteCategory(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
