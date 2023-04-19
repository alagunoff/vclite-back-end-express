const { ValidationError } = require('sequelize')

const { createErrorsObject } = require('../shared/utils/errors')
const {
  createPaginationParameters,
  createPaginatedResponse
} = require('../shared/utils/pagination')
const { setSubcategories } = require('../shared/utils/categories')
const Category = require('../models/category')

async function createCategory (req, res) {
  try {
    await Category.create({
      category: req.body.category,
      parentCategoryId: req.body.parentCategoryId
    })

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

async function getCategories (req, res) {
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.itemsNumber,
      req.query.pageNumber
    )
    const categories = await Category.findAll({
      limit,
      offset,
      where: {
        parentCategoryId: null
      }
    })

    for (const category of categories) {
      await setSubcategories(category)
    }

    res.json(createPaginatedResponse(categories, categories.length, limit))
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function updateCategory (req, res) {
  try {
    const categoryToUpdate = await Category.findByPk(req.params.id)

    if (categoryToUpdate) {
      try {
        await categoryToUpdate.update({ category: req.body.category })

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

async function deleteCategory (req, res) {
  try {
    const categoryToDelete = await Category.findByPk(req.params.id)

    if (categoryToDelete) {
      try {
        await categoryToDelete.destroy()

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
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
}
