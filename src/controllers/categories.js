const { ValidationError } = require("sequelize");

const {
  createErrorsObject,
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils");
const Category = require("../models/category");

async function createCategory(req, res) {
  try {
    await Category.create({
      category: req.body.category,
      parentCategoryId: req.body.parentCategoryId,
    });

    res.status(201).end();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json(createErrorsObject(error));
    } else {
      res.status(500).end();
    }
  }
}

async function getCategories(req, res) {
  const { limit, offset } = createPaginationParameters(
    req.query.itemsNumber,
    req.query.pageNumber
  );

  try {
    const { rows, count } = await Category.findAndCountAll({
      limit,
      offset,
      hierarchy: true,
    });

    res.json(createPaginatedResponse(rows, count, limit));
  } catch {
    res.status(500).end();
  }
}

async function updateCategory(req, res) {
  const categoryToUpdate = await Category.findByPk(req.params.id);

  if (categoryToUpdate) {
    try {
      await categoryToUpdate.update({ category: req.body.category });

      res.status(204).end();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(createErrorsObject(error));
      } else {
        res.status(500).end();
      }
    }
  } else {
    res.status(404).end();
  }
}

async function deleteCategory(req, res) {
  const categoryToDelete = await Category.findByPk(req.params.id);

  if (categoryToDelete) {
    try {
      await categoryToDelete.destroy();

      res.status(204).end();
    } catch {
      res.status(500).end();
    }
  } else {
    res.status(404).end();
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
