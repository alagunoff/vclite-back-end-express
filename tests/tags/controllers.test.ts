import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "collections/tags/controllers";
import * as services from "collections/tags/services";
import * as validators from "collections/tags/validators";
import { ApiError } from "shared/errors/classes";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

jest.mock("collections/tags/validators");
jest.mock("collections/tags/services");
jest.mock("shared/pagination/validator");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);
const mockPaginationQueryParametersValidator = jest.mocked(
  validatePaginationQueryParameters
);

describe("createTag", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ name: "required" });

    const { res: mockRes } = getMockRes();

    await createTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is tag's creation error", async () => {
    const apiError = new ApiError(422);
    mockServices.createTag.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when tag has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getTags", () => {
  test("should set response status 400 when there are pagination query parameters validation errors", async () => {
    mockPaginationQueryParametersValidator.mockReturnValue({
      pageNumber: "required",
    });

    const { res: mockRes } = getMockRes();

    await getTags(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should call json method on response when there are no errors", async () => {
    const { res: mockRes } = getMockRes();

    await getTags(getMockReq(), mockRes);

    expect(mockRes.json).toBeCalled();
  });
});

describe("updateTag", () => {
  test("should set response status 400 when there are update data validation errors", async () => {
    mockValidators.validateUpdateData.mockReturnValue({
      name: "required",
    });

    const { res: mockRes } = getMockRes();

    await updateTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is tag's update error", async () => {
    const apiError = new ApiError(422);
    mockServices.updateTag.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await updateTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when tag has been updated", async () => {
    const { res: mockRes } = getMockRes();

    await updateTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});

describe("deleteTag", () => {
  test("should set response status to api error code when there is tag's deletion error", async () => {
    const apiError = new ApiError(422);
    mockServices.deleteTag.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deleteTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when tag has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deleteTag(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
