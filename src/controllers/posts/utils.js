const { Op } = require('sequelize')

function createWhereOptions (req) {
  const options = {
    isDraft: false,
    createdAt: {}
  }

  if (req.query.createdAt) {
    options.createdAt = req.query.createdAt
  }

  if (req.query.createdAt__lt) {
    options.createdAt[Op.lt] = req.query.createdAt__lt
  }

  if (req.query.createdAt__gt) {
    options.createdAt[Op.gt] = req.query.createdAt__gt
  }

  if (req.query.authorName) {
    options['$author.user.firstName$'] = req.query.authorName
  }

  if (req.query.categoryId) {
    options['$category.id$'] = req.query.categoryId
  }

  if (req.query.tagId) {
    options['$tags.id$'] = req.query.tagId
  }

  if (req.query.tags__in) {
    options['$tags.id$'] = {
      [Op.or]: JSON.parse(req.query.tags__in)
    }
  }

  if (req.query.tags__all) {
    options['$tags.id$'] = {
      [Op.in]: JSON.parse(req.query.tags__all)
    }
  }

  if (req.query.title__contains) {
    options.title = {
      [Op.substring]: req.query.title__contains
    }
  }

  if (req.query.content__contains) {
    options.content = {
      [Op.substring]: req.query.content__contains
    }
  }

  return options
}

function createOrderOptions (req) {
  if (req.query.orderBy === 'createdAt') {
    return [['createdAt', 'ASC']]
  }

  if (req.query.orderBy === '-createdAt') {
    return [['createdAt', 'DESC']]
  }

  if (req.query.orderBy === 'authorName') {
    return [['author', 'user', 'firstName', 'ASC']]
  }

  if (req.query.orderBy === '-authorName') {
    return [['author', 'user', 'firstName', 'DESC']]
  }

  if (req.query.orderBy === 'categoryName') {
    return [['category', 'category', 'ASC']]
  }

  if (req.query.orderBy === '-categoryName') {
    return [['category', 'category', 'DESC']]
  }

  if (req.query.orderBy === 'imagesNumber') {
    return [['extraImagesNumber', 'ASC']]
  }

  if (req.query.orderBy === '-imagesNumber') {
    return [['extraImagesNumber', 'DESC']]
  }
}

module.exports = {
  createWhereOptions,
  createOrderOptions
}
