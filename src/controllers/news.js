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
const News = require("../models/news");
const Author = require("../models/author");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Comment = require("../models/comment");

async function createNews(req, res) {
  const createdNews = News.build({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    categoryId: req.body.categoryId,
    mainImage: req.body.mainImage,
  });

  try {
    await createdNews.validate();

    if (req.body.mainImage) {
      await createdNews.save({
        fields: ["title", "content", "authorId", "categoryId"],
        validate: false,
      });

      createdNews.mainImage = saveImageToStaticFiles(
        req.body.mainImage,
        "news",
        `${createdNews.id}-main`
      );
    }

    await createdNews.setTags(req.body.tagsIds);
    await createdNews.save({ validate: false });

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

async function getNews(req, res) {
  const { limit, offset } = createPaginationParameters(
    req.query.itemsNumber,
    req.query.pageNumber
  );

  try {
    const news = await News.findAll({
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

    for (const newsItem of news) {
      await setSubcategories(newsItem.category);

      if (newsItem.mainImage) {
        newsItem.mainImage = getImageUrl("news", newsItem.mainImage);
      }
    }

    res.json(createPaginatedResponse(news, news.length, limit));
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteNews(req, res) {
  const newsToDelete = await News.findByPk(req.params.id);

  if (newsToDelete) {
    try {
      await newsToDelete.destroy();

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
  createNews,
  getNews,
  deleteNews,
};
