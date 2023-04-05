const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const db = require("../configs/db");
const { deleteImageFromStaticFiles } = require("../shared/utils/images");
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
      unique: {
        arg: true,
        msg: "already taken",
      },
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
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
        isBase64Image: validators.isBase64Image,
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
