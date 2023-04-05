function createErrorsObject(error) {
  return error.errors.reduce((errors, { path, message }) => {
    errors[path] = message;

    return errors;
  }, {});
}

module.exports = {
  createErrorsObject,
};
