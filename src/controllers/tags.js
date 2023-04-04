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
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.items_number,
      req.query.page_number
    );
    const { rows, count } = await Tag.findAndCountAll({ limit, offset });

    res.json(createPaginatedResponse(rows, count, limit));
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  createTag,
  getTags,
};
