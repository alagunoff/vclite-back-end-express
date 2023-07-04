import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "collections/posts/controllers";
import * as services from "collections/posts/services";
import * as validators from "collections/posts/validators";
import { ApiError } from "shared/errors/classes";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

jest.mock("collections/posts/validators");
jest.mock("collections/posts/services");
jest.mock("shared/pagination/validator");

const mockValidators = jest.mocked(validators);
const mockServices = jest.mocked(services);
const mockPaginationQueryParametersValidator = jest.mocked(
  validatePaginationQueryParameters
);

describe("createPost", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockValidators.validateCreationData.mockReturnValue({ title: "required" });

    const { res: mockRes } = getMockRes();

    await createPost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is post's creation error", async () => {
    const apiError = new ApiError(422);
    mockServices.createPost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createPost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when post has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createPost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getPosts", () => {
  test("should set response status 400 when there are filter query parameters validation errors", async () => {
    mockValidators.validateFilterQueryParameters.mockReturnValue({
      titleContains: "required",
    });

    const { res: mockRes } = getMockRes();

    await getPosts(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status 400 when there are pagination query parameters validation errors", async () => {
    mockPaginationQueryParametersValidator.mockReturnValue({
      pageNumber: "required",
    });

    const { res: mockRes } = getMockRes();

    await getPosts(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status 400 when there are order query parameters validation errors", async () => {
    mockValidators.validateOrderQueryParameters.mockReturnValue({
      orderBy: "required",
    });

    const { res: mockRes } = getMockRes();

    await getPosts(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should call json method on response when there are no errors", async () => {
    const { res: mockRes } = getMockRes();

    await getPosts(getMockReq(), mockRes);

    expect(mockRes.json).toBeCalled();
  });
});

describe("updatePost", () => {
  test("should set response status 400 when there are update data validation errors", async () => {
    mockValidators.validateUpdateData.mockReturnValue({
      title: "required",
    });

    const { res: mockRes } = getMockRes();

    await updatePost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is post's update error", async () => {
    const apiError = new ApiError(422);
    mockServices.updatePost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await updatePost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when post has been updated", async () => {
    const { res: mockRes } = getMockRes();

    await updatePost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});

describe("deletePost", () => {
  test("should set response status to api error code when there is post's deletion error", async () => {
    const apiError = new ApiError(422);
    mockServices.deletePost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deletePost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when post has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deletePost(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
