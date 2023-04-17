const sequelize = require("sequelize");

function createOrderOptions(req) {
  if (req.query.orderBy === "createdAt") {
    return [["createdAt", "ASC"]];
  }

  if (req.query.orderBy === "-createdAt") {
    return [["createdAt", "DESC"]];
  }

  if (req.query.orderBy === "authorName") {
    return [["author", "user", "firstName", "ASC"]];
  }

  if (req.query.orderBy === "-authorName") {
    return [["author", "user", "firstName", "DESC"]];
  }

  if (req.query.orderBy === "categoryName") {
    return [["category", "category", "ASC"]];
  }

  if (req.query.orderBy === "-categoryName") {
    return [["category", "category", "DESC"]];
  }

  if (req.query.orderBy === "imagesNumber") {
    return [[sequelize.literal('"extraImagesNumber"'), "ASC"]];
  }

  if (req.query.orderBy === "-imagesNumber") {
    return [[sequelize.literal('"extraImagesNumber"'), "DESC"]];
  }
}

module.exports = {
  createOrderOptions,
};
