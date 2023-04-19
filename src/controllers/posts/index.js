const sequelize = require('sequelize')

const { createErrorsObject } = require('../../shared/utils/errors')
const {
  createPaginationParameters,
  createPaginatedResponse
} = require('../../shared/utils/pagination')
const { setSubcategories } = require('../../shared/utils/categories')
const { saveImageToStaticFiles } = require('../../shared/utils/images')
const {
  transformStringToLowercasedKebabString
} = require('../../shared/utils/strings')
const Post = require('../../models/post')
const User = require('../../models/user')
const Author = require('../../models/author')
const Category = require('../../models/category')
const Tag = require('../../models/tag')
const Comment = require('../../models/comment')
const PostExtraImage = require('../../models/postExtraImage')
const { createWhereOptions, createOrderOptions } = require('./utils')

async function createPost (req, res) {
  try {
    const createdPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
      categoryId: req.body.categoryId,
      image: req.body.image
    })
    await createdPost.setTags(req.body.tagsIds)

    if (Array.isArray(req.body.extraImages)) {
      for (const extraImage of req.body.extraImages) {
        const createdPostExtraImage = PostExtraImage.build({
          image: extraImage,
          post_id: createdPost.id
        })

        await createdPostExtraImage.validate()
        await createdPostExtraImage.save({
          validate: false,
          fields: ['post_id']
        })

        createdPostExtraImage.image = saveImageToStaticFiles(
          extraImage,
          `posts/${transformStringToLowercasedKebabString(createdPost.title)}`,
          `extra-${createdPostExtraImage.id}`
        )

        await createdPostExtraImage.save({ validate: false })
      }
    }

    res.status(201).end()
  } catch (error) {
    console.log(error)

    if (error instanceof sequelize.ValidationError) {
      res.status(400).json(createErrorsObject(error))
    } else {
      res.status(500).end()
    }
  }
}

async function getPosts (req, res) {
  try {
    const { limit, offset } = createPaginationParameters(
      req.query.itemsNumber,
      req.query.pageNumber
    )
    const posts = await Post.findAll({
      where: createWhereOptions(req),
      limit,
      offset,
      order: createOrderOptions(req),
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM post_extra_images WHERE post_extra_images.post_id = Post.id)'
            ),
            'extraImagesNumber'
          ]
        ],
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

    for (const post of posts) {
      await setSubcategories(post.category)
    }

    res.json(createPaginatedResponse(posts, posts.length, limit))
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function updatePost (req, res) {
  try {
    const postToUpdate = await Post.findByPk(req.params.id)

    if (postToUpdate) {
      try {
        await postToUpdate.update({
          title: req.body.title,
          content: req.body.content,
          authorId: req.body.authorId,
          categoryId: req.body.categoryId,
          image: req.body.image
        })

        if (req.body.tagsIds) {
          await postToUpdate.setTags(req.body.tagsIds)
        }

        res.status(204).end()
      } catch (error) {
        console.log(error)

        if (error instanceof sequelize.ValidationError) {
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

async function deletePost (req, res) {
  try {
    const postToDelete = await Post.findByPk(req.params.id)

    if (postToDelete) {
      try {
        await postToDelete.destroy()

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
  createPost,
  getPosts,
  updatePost,
  deletePost
}
