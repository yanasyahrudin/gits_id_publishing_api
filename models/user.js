"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Username is required" },
          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 50 characters",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          isLongEnough(value) {
            if (value && value.length < 6) {
              throw new Error("Password must be at least 6 characters long");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (user, options) => {
    if (user.password) user.password = await bcrypt.hash(user.password, 10);
  });
  User.beforeUpdate(async (user, options) => {
    if (user.changed("password"))
      user.password = await bcrypt.hash(user.password, 10);
  });
  User.prototype.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  return User;
};
