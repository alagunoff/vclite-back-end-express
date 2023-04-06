const { ValidationError } = require("sequelize");

const { createErrorsObject } = require("../shared/utils/errors");
const {
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils/pagination");
const { setSubcategories } = require("../shared/utils/categories");
const { saveImageToStaticFiles } = require("../shared/utils/images");
const Post = require("../models/post");
const Author = require("../models/author");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Comment = require("../models/comment");
const PostExtraImage = require("../models/postExtraImage");

async function createPost(req, res) {
  try {
    const createdPost = await Post.create(req.body);
    await createdPost.setTags(req.body.tagsIds);

    if (Array.isArray(req.body.extraImages)) {
      for (const extraImage of req.body.extraImages) {
        const createdPostExtraImage = PostExtraImage.build({
          image: extraImage,
          postId: createdPost.id,
        });

        await createdPostExtraImage.validate();

        createdPostExtraImage.image = saveImageToStaticFiles(
          extraImage,
          "posts",
          `${createdPost.id}-extra-${createdPostExtraImage.id}`
        );

        await createdPostExtraImage.save({ validate: false });
      }
    }

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

async function getPosts(req, res) {
  const { limit, offset } = createPaginationParameters(
    req.query.itemsNumber,
    req.query.pageNumber
  );

  try {
    const posts = await Post.findAll({
      limit,
      offset,
      attributes: {
        exclude: ["authorId", "categoryId"],
      },
      include: [
        Author,
        Category,
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["newsId"],
          },
        },
      ],
    });

    for (const post of posts) {
      await setSubcategories(post.category);
    }

    res.json(createPaginatedResponse(posts, posts.length, limit));
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deletePost(req, res) {
  const postToDelete = await Post.findByPk(req.params.id);

  if (postToDelete) {
    try {
      await postToDelete.destroy();

      res.status(204).end();
    } catch (error) {
      console.log(error);

      res.status(500).end();
    }
  } else {
    res.status(404).end();
  }
}

module.exports = {
  createPost,
  getPosts,
  deletePost,
};
