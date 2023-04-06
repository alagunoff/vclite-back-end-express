const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const {
  saveImageToStaticFiles,
  deleteImageFromStaticFiles,
} = require("../shared/utils/images");
const validators = require("../shared/validators");
const Author = require("./author");
const Category = require("./category");
const Tag = require("./tag");

const Post = db.define(
  "post",
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
        async isUnique(value) {
          if (await Post.findOne({ where: { title: value } })) {
            throw Error("already taken");
          }
        },
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
    image: {
      type: DataTypes.STRING,
      validate: {
        isBase64ImageDataUrl: validators.isBase64ImageDataUrl,
      },
    },
  },
  {
    updatedAt: false,
    hooks: {
      beforeCreate(post) {
        if (post.image) {
          post.image = saveImageToStaticFiles(
            post.image,
            `posts/${post.title
              .split(" ")
              .map((word) => word.toLowerCase())
              .join("-")}`,
            "main"
          );
        }
      },
      afterDestroy(post) {
        if (post.image) {
          deleteImageFromStaticFiles(post.image);
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

Post.belongsToMany(Tag, { through: "PostsTags" });
Tag.belongsToMany(Post, { through: "PostsTags" });

module.exports = Post;
