const { ValidationError } = require("sequelize");

const {
  createErrorsObject,
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils");
const Author = require("../models/author");

async function createAuthor(req, res) {
  try {
    await Author.create({
      description: req.body.description,
      userId: req.body.userId,
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

async function getAuthors(req, res) {
  const { limit, offset } = createPaginationParameters(
    req.query.itemsNumber,
    req.query.pageNumber
  );

  try {
    const { rows, count } = await Author.findAndCountAll({ limit, offset });

    res.json(createPaginatedResponse(rows, count, limit));
  } catch {
    res.status(500).end();
  }
}

async function updateAuthor(req, res) {
  const authorToUpdate = await Author.findByPk(req.params.id);

  if (authorToUpdate) {
    try {
      await authorToUpdate.update({
        description: req.body.description,
        userId: req.body.userId,
      });

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

async function deleteAuthor(req, res) {
  const authorToDelete = await Author.findByPk(req.params.id);

  if (authorToDelete) {
    try {
      await authorToDelete.destroy();

      res.status(204).end();
    } catch {
      res.status(500).end();
    }
  } else {
    res.status(404).end();
  }
}

module.exports = {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
};
