"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Author, { foreignKey: "authorId", as: "author" });
      Book.belongsTo(models.Publisher, {
        foreignKey: "publisherId",
        as: "publisher",
      });
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title is required" },
          len: { args: [1, 255], msg: "Title must be 1-255 characters" },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "authorId must be an integer" },
          notNull: { msg: "authorId is required" },
        },
      },
      publisherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "publisherId must be an integer" },
          notNull: { msg: "publisherId is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
