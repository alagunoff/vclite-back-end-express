const { ValidationError } = require("sequelize");

const { createErrorsObject } = require("../shared/utils/errors");
const {
  createPaginationParameters,
  createPaginatedResponse,
} = require("../shared/utils/pagination");
const { addSubcategories } = require("../shared/utils/categories");
const News = require("../models/news");
const Author = require("../models/author");
const Category = require("../models/category");
const Tag = require("../models/tag");

async function createNews(req, res) {
  try {
    const createdNews = await News.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
      categoryId: req.body.categoryId,
      tagsIds: req.body.tagsIds,
    });
    await createdNews.setTags(req.body.tagsIds);

    res.status(201).end();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json(createErrorsObject(error));
    } else {
      console.log(error);
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
      ],
    });

    for (const newsItem of news) {
      await addSubcategories(newsItem.category);
    }

    res.json(createPaginatedResponse(news, news.length, limit));
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

module.exports = {
  createNews,
  getNews,
};
