const { DataTypes } = require('sequelize')

const db = require('../configs/db')
const validators = require('../shared/validators')
const Post = require('./post')

const Comment = db.define(
  'comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'required'
        },
        isNotEmptyString: validators.isNotEmptyString
      }
    }
  },
  {
    timestamps: false
  }
)

Comment.belongsTo(Post, {
  foreignKey: {
    allowNull: false
  }
})
Post.hasMany(Comment, {
  onDelete: 'CASCADE'
})

module.exports = Comment
