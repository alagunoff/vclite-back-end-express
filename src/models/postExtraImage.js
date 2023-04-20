const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const validators = require("../shared/validators");
const Post = require("./post");

const PostExtraImage = db.define(
  "postExtraImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isBase64ImageDataUrl: validators.isBase64ImageDataUrl,
      },
    },
  },
  {
    timestamps: false,
    tableName: "post_extra_images",
  }
);

PostExtraImage.belongsTo(Post, {
  foreignKey: {
    name: "post_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Post.hasMany(PostExtraImage, {
  foreignKey: {
    name: "post_id",
  },
  as: "extraImages",
});

module.exports = PostExtraImage;
