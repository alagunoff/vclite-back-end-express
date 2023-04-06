const { ValidationError } = require("sequelize");

const { createErrorsObject } = require("../shared/utils/errors");
const {
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils/pagination");
const { setSubcategories } = require("../shared/utils/categories");
const {
  saveImageToStaticFiles,
  getImageUrl,
} = require("../shared/utils/images");
const Post = require("../models/post");
const Author = require("../models/author");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Comment = require("../models/comment");

async function createPost(req, res) {
  const createdPost = Post.build({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    categoryId: req.body.categoryId,
    mainImage: req.body.mainImage,
  });

  try {
    await createdPost.validate();

    if (req.body.mainImage) {
      await createdPost.save({
        fields: ["title", "content", "authorId", "categoryId"],
        validate: false,
      });

      createdPost.mainImage = saveImageToStaticFiles(
        req.body.mainImage,
        "posts",
        `${createdPost.id}-main`
      );
    }

    await createdPost.setTags(req.body.tagsIds);
    await createdPost.save({ validate: false });

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

      if (post.mainImage) {
        post.mainImage = getImageUrl("posts", post.mainImage);
      }
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
