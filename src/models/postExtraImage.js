const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const { deleteImageFromStaticFiles } = require("../shared/utils/images");
const validators = require("../shared/validators");

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
    hooks: {
      afterDestroy(postExtraImage) {
        if (postExtraImage.image) {
          deleteImageFromStaticFiles(postExtraImage.image);
        }
      },
    },
  }
);

module.exports = PostExtraImage;
