const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const validators = require("../shared/validators");
const News = require("./news");

const Comment = db.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
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
    timestamps: false,
  }
);

Comment.belongsTo(News, {
  foreignKey: {
    allowNull: false,
  },
});
News.hasMany(Comment, {
  onDelete: "CASCADE",
});

module.exports = Comment;
