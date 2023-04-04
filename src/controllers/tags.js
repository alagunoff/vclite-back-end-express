const {
  createErrorsObject,
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils");
const Tag = require("../models/tag");

async function createTag(req, res) {
  try {
    await Tag.create({ tag: req.body.tag });

    res.status(201).end();
  } catch (error) {
    res.status(400).json(createErrorsObject(error));
  }
}

async function getTags(req, res) {
  const { limit, offset } = createPaginationParameters(
    req.query.itemsNumber,
    req.query.pageNumber
  );

  try {
    const { rows, count } = await Tag.findAndCountAll({ limit, offset });

    res.json(createPaginatedResponse(rows, count, limit));
  } catch {
    res.status(500).end();
  }
}

async function updateTag(req, res) {
  const tagToUpdate = await Tag.findByPk(req.params.id);

  if (tagToUpdate) {
    try {
      await tagToUpdate.update({ tag: req.body.tag });

      res.status(204).end();
    } catch (error) {
      res.status(400).json(createErrorsObject(error));
    }
  } else {
    res.status(404).end();
  }
}

async function deleteTag(req, res) {
  const tagToDelete = await Tag.findByPk(req.params.id);

  if (tagToDelete) {
    try {
      await tagToDelete.destroy();

      res.status(204).end();
    } catch {
      res.status(500).end();
    }
  } else {
    res.status(404).end();
  }
}

module.exports = {
  createTag,
  getTags,
  updateTag,
  deleteTag,
};
