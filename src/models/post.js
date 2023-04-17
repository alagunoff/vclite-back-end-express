const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const {
  saveImageToStaticFiles,
  deleteImageFolderFromStaticFiles,
} = require("../shared/utils/images");
const {
  transformStringToLowercasedKebabString,
} = require("../shared/utils/strings");
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
      allowNull: false,
      validate: {
        notNull: {
          msg: "required",
        },
        isBase64ImageDataUrl: validators.isBase64ImageDataUrl,
      },
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeSave(post) {
        post.image = saveImageToStaticFiles(
          post.image,
          `posts/${transformStringToLowercasedKebabString(post.title)}`,
          "main"
        );
      },
      afterDestroy(post) {
        deleteImageFolderFromStaticFiles(post.image);
      },
    },
  }
);

Post.belongsTo(Author, {
  as: "author",
  foreignKey: {
    allowNull: false,
  },
});
Author.hasMany(Post);

Post.belongsTo(Category, {
  as: "category",
  foreignKey: {
    allowNull: false,
  },
});
Category.hasMany(Post);

Post.belongsToMany(Tag, { through: "PostsTags" });
Tag.belongsToMany(Post, { through: "PostsTags" });

module.exports = Post;
