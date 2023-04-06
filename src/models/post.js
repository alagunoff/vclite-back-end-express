const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const { deleteImageFromStaticFiles } = require("../shared/utils/images");
const validators = require("../shared/validators");
const Author = require("./author");
const Category = require("./category");
const Tag = require("./tag");

const Post = db.define(
  "posts",
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
    mainImage: {
      type: DataTypes.STRING,
      validate: {
        isBase64ImageDataUrl: validators.isBase64ImageDataUrl,
      },
    },
  },
  {
    updatedAt: false,
    hooks: {
      afterDestroy(news) {
        if (news.mainImage) {
          deleteImageFromStaticFiles("posts", news.mainImage);
        }
      },
    },
  }
);

Post.belongsTo(Author, {
  foreignKey: {
    allowNull: false,
  },
});
Author.hasMany(Post);

Post.belongsTo(Category, {
  foreignKey: {
    allowNull: false,
  },
});
Category.hasMany(Post);

Post.belongsToMany(Tag, { through: "posts_tags" });
Tag.belongsToMany(Post, { through: "posts_tags" });

module.exports = Post;
