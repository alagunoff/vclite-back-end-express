const { ValidationError } = require('sequelize')

const { createErrorsObject } = require('../shared/utils/errors')
const {
  createPaginationParameters,
  createPaginatedResponse
} = require('../shared/utils/pagination')
const Tag = require('../models/tag')

async function createTag (req, res) {
  try {
    await Tag.create({ tag: req.body.tag })

    res.status(201).end()
  } catch (error) {
    console.log(error)

    if (error instanceof ValidationError) {
      res.status(400).json(createErrorsObject(error))
    } else {
      res.status(500).end()
    }
  }
}

async function getTags (req, res) {
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.itemsNumber,
      req.query.pageNumber
    )
    const tags = await Tag.findAll({ limit, offset })

    res.json(createPaginatedResponse(tags, tags.length, limit))
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function updateTag (req, res) {
  try {
    const tagToUpdate = await Tag.findByPk(req.params.id)

    if (tagToUpdate) {
      try {
        await tagToUpdate.update({ tag: req.body.tag })

        res.status(204).end()
      } catch (error) {
        console.log(error)

        if (error instanceof ValidationError) {
          res.status(400).json(createErrorsObject(error))
        } else {
          res.status(500).end()
        }
      }
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function deleteTag (req, res) {
  try {
    const tagToDelete = await Tag.findByPk(req.params.id)

    if (tagToDelete) {
      try {
        await tagToDelete.destroy()

        res.status(204).end()
      } catch (error) {
        console.log(error)

        res.status(500).end()
      }
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

module.exports = {
  createTag,
  getTags,
  updateTag,
  deleteTag
}
