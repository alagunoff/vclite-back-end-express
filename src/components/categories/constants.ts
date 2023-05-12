const CREATION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE = {
  categoryAlreadyExists: 422,
  parentCategoryNotFound: 422,
  unknown: 500,
};
const CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE = {
  categoryAlreadyExists: "category with this name already exists",
  parentCategoryNotFound: "parent category with this id not found",
  unknown: "unknown error",
};

const UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE = {
  categoryNotFound: 404,
  categoryAlreadyExists: 422,
  parentCategoryNotFound: 422,
  unknown: 500,
};
const UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE = {
  categoryNotFound: "category with this id not found",
  categoryAlreadyExists: "category with this name already exists",
  parentCategoryNotFound: "parent category with this id not found",
  unknown: "unknown error",
};

const DELETION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE = {
  categoryNotFound: 404,
  unknown: 500,
};
const DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE = {
  categoryNotFound: "category with this id not found",
  unknown: "unknown error",
};

export {
  CREATION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  DELETION_FAILURE_REASON_TO_RESPONSE_STATUS_CODE,
  DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
};
