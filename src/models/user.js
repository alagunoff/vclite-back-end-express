const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const db = require("../configs/db");
const {
  saveImageToStaticFiles,
  deleteImageFromStaticFiles,
} = require("../shared/utils/images");
const validators = require("../shared/validators");

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
        isUnique(value) {
          if (User.findOne({ where: { username: value } })) {
            throw Error("already taken");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isBase64ImageDataUrl: validators.isBase64ImageDataUrl,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    updatedAt: false,
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password);

        if (user.image) {
          user.image = saveImageToStaticFiles(
            user.image,
            "users",
            user.username
          );
        }
      },
      afterDestroy(user) {
        if (user.image) {
          deleteImageFromStaticFiles("users", user.image);
        }
      },
    },
  }
);

module.exports = User;
