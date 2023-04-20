const { ValidationError } = require("sequelize");

const { createErrorsObject } = require("../shared/utils/errors");
const {
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils/pagination");
const Comment = require("../models/comment");

async function createComment(req, res) {
  try {
    await Comment.create({
      comment: req.body.comment,
      postId: req.params.postId,
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    if (error instanceof ValidationError) {
      res.status(400).json(createErrorsObject(error));
    } else {
      res.status(500).end();
    }
  }
}

async function getComments(req, res) {
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.itemsNumber,
      req.query.pageNumber
    );
    const comments = await Comment.findAll({
      limit,
      offset,
      where: {
        postId: req.params.postId,
      },
    });

    res.json(createPaginatedResponse(comments, comments.length, limit));
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteComments(req, res) {
  try {
    await Comment.destroy({ where: { postId: req.params.postId } });

    res.status(204).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

module.exports = {
  createComment,
  getComments,
  deleteComments,
};
