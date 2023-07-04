import { jest, describe, test, expect } from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";

import {
  createDraft,
  getDrafts,
  updateDraft,
  publishDraft,
  deleteDraft,
} from "collections/drafts/controllers";
import * as postServices from "collections/posts/services";
import * as postValidators from "collections/posts/validators";
import { ApiError } from "shared/errors/classes";
import { validatePaginationQueryParameters } from "shared/pagination/validator";

jest.mock("collections/posts/validators");
jest.mock("collections/posts/services");
jest.mock("shared/pagination/validator");

const mockPostValidators = jest.mocked(postValidators);
const mockPostServices = jest.mocked(postServices);
const mockPaginationQueryParametersValidator = jest.mocked(
  validatePaginationQueryParameters
);

describe("createDraft", () => {
  test("should set response status 400 when there are creation data validation errors", async () => {
    mockPostValidators.validateCreationData.mockReturnValue({
      title: "required",
    });

    const { res: mockRes } = getMockRes();

    await createDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is draft's creation error", async () => {
    const apiError = new ApiError(422);
    mockPostServices.createPost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await createDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when draft has been created", async () => {
    const { res: mockRes } = getMockRes();

    await createDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("getDrafts", () => {
  test("should set response status 400 when there are pagination query parameters validation errors", async () => {
    mockPaginationQueryParametersValidator.mockReturnValue({
      pageNumber: "required",
    });

    const { res: mockRes } = getMockRes();

    await getDrafts(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should call json method on response when there are no errors", async () => {
    mockPostServices.getPosts.mockResolvedValue({
      posts: [],
      postsTotalNumber: 0,
      pagesTotalNumber: 1,
    });

    const { res: mockRes } = getMockRes();

    await getDrafts(getMockReq(), mockRes);

    expect(mockRes.json).toBeCalled();
  });
});

describe("updateDraft", () => {
  test("should set response status 400 when there are update data validation errors", async () => {
    mockPostValidators.validateUpdateData.mockReturnValue({
      title: "required",
    });

    const { res: mockRes } = getMockRes();

    await updateDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(400);
  });

  test("should set response status to api error code when there is draft's update error", async () => {
    const apiError = new ApiError(422);
    mockPostServices.updatePost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await updateDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when draft has been updated", async () => {
    const { res: mockRes } = getMockRes();

    await updateDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});

describe("publishDraft", () => {
  test("should set response status to api error code when there is draft's publishing error", async () => {
    const apiError = new ApiError(422);
    mockPostServices.updatePost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await publishDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 201 when draft has been published", async () => {
    const { res: mockRes } = getMockRes();

    await publishDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe("deleteDraft", () => {
  test("should set response status to api error code when there is draft's deletion error", async () => {
    const apiError = new ApiError(422);
    mockPostServices.deletePost.mockResolvedValue(apiError);

    const { res: mockRes } = getMockRes();

    await deleteDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(apiError.code);
  });

  test("should set response status 204 when draft has been deleted", async () => {
    const { res: mockRes } = getMockRes();

    await deleteDraft(getMockReq(), mockRes);

    expect(mockRes.status).toBeCalledWith(204);
  });
});
