const path = require("path");
const fs = require("fs");

function createErrorsObject(error) {
  return error.errors.reduce((errors, { path, message }) => {
    errors[path] = message;

    return errors;
  }, {});
}

function saveUserImageToStaticFiles(user) {
  const [mimeType, base64Image] = user.image.slice(5).split(";base64,");
  const imageExtension = mimeType.split("/")[1];
  const imagePath = path.join(
    __dirname,
    `../../static/images/users/${user.username}.${imageExtension}`
  );

  fs.writeFileSync(imagePath, Buffer.from(base64Image, "base64"));

  return `${user.username}.${imageExtension}`;
}

function createPaginationParameters(itemsNumber, pageNumber) {
  const limit = Number(itemsNumber) || undefined;
  const pageNumberAsNumber = Number(pageNumber);

  return {
    limit,
    offset:
      limit && pageNumberAsNumber > 1
        ? limit * (pageNumberAsNumber - 1)
        : undefined,
  };
}

function createPaginatedResponse(rows, count, limit) {
  return {
    items: rows,
    total_items_number: count,
    total_pages_number: count && limit ? Math.ceil(count / limit) : 1,
  };
}

module.exports = {
  createErrorsObject,
  saveUserImageToStaticFiles,
  createPaginationParameters,
  createPaginatedResponse,
};
