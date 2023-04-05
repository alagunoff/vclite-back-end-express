const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const validators = require("../shared/validators");
const Author = require("./author");
const Category = require("./category");
const Tag = require("./tag");

const News = db.define(
  "news",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
  },
  {
    updatedAt: false,
  }
);

News.belongsTo(Author, {
  foreignKey: {
    allowNull: false,
  },
});
Author.hasMany(News);

News.belongsTo(Category, {
  foreignKey: {
    allowNull: false,
  },
});
Category.hasMany(News);

News.belongsToMany(Tag, { through: "news_tags" });
Tag.belongsToMany(News, { through: "news_tags" });

module.exports = News;
