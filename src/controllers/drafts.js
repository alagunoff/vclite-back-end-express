const { ValidationError } = require('sequelize')

const { createErrorsObject } = require('../shared/utils/errors')
const {
  createPaginationParameters,
  createPaginatedResponse
} = require('../shared/utils/pagination')
const { setSubcategories } = require('../shared/utils/categories')
const { saveImageToStaticFiles } = require('../shared/utils/images')
const {
  transformStringToLowercasedKebabString
} = require('../shared/utils/strings')
const Post = require('../models/post')
const User = require('../models/user')
const Author = require('../models/author')
const Category = require('../models/category')
const Tag = require('../models/tag')
const Comment = require('../models/comment')
const PostExtraImage = require('../models/postExtraImage')

async function createDraft (req, res) {
  try {
    const createdDraft = await Post.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
      categoryId: req.body.categoryId,
      image: req.body.image,
      isDraft: true
    })
    await createdDraft.setTags(req.body.tagsIds)

    if (Array.isArray(req.body.extraImages)) {
      for (const extraImage of req.body.extraImages) {
        const createdDraftExtraImage = PostExtraImage.build({
          image: extraImage,
          post_id: createdDraft.id
        })

        await createdDraftExtraImage.validate()
        await createdDraftExtraImage.save({
          validate: false,
          fields: ['post_id']
        })

        createdDraftExtraImage.image = saveImageToStaticFiles(
          extraImage,
          `posts/${transformStringToLowercasedKebabString(createdDraft.title)}`,
          `extra-${createdDraftExtraImage.id}`
        )

        await createdDraftExtraImage.save({ validate: false })
      }
    }

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

async function getDrafts (req, res) {
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.itemsNumber,
      req.query.pageNumber
    )
    const drafts = await Post.findAll({
      where: {
        isDraft: true,
        '$author.user.id$': req.authenticatedUserId
      },
      limit,
      offset,
      attributes: {
        exclude: ['authorId', 'categoryId']
      },
      include: [
        {
          model: Author,
          as: 'author',
          attributes: {
            exclude: ['userId']
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: ['password']
              }
            }
          ]
        },
        {
          model: Category,
          as: 'category'
        },
        {
          model: Tag,
          through: { attributes: [] }
        },
        {
          model: Comment,
          attributes: {
            exclude: ['postId']
          }
        },
        {
          model: PostExtraImage,
          as: 'extraImages',
          attributes: {
            exclude: ['post_id']
          }
        }
      ]
    })

    for (const draft of drafts) {
      await setSubcategories(draft.category)
    }

    res.json(createPaginatedResponse(drafts, drafts.length, limit))
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function updateDraft (req, res) {
  try {
    const draftToUpdate = await Post.findByPk(req.params.id)

    if (draftToUpdate) {
      try {
        await draftToUpdate.update({
          title: req.body.title,
          content: req.body.content,
          authorId: req.body.authorId,
          categoryId: req.body.categoryId,
          image: req.body.image,
          isDraft: req.body.isDraft
        })

        if (req.body.tagsIds) {
          await draftToUpdate.setTags(req.body.tagsIds)
        }

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

async function deleteDraft (req, res) {
  try {
    const draftToDelete = await Post.findByPk(req.params.id)

    if (draftToDelete) {
      try {
        await draftToDelete.destroy()

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
  createDraft,
  getDrafts,
  updateDraft,
  deleteDraft
}
