const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./category.model");

const LearningImage = sequelize.define(
  "LearningImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Apple", "Ball", "Cat"
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false, // Path to uploaded image file
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // true for system default images
    },
  },
  {
    tableName: "learning_images",
    timestamps: true,
  }
);

LearningImage.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(LearningImage, { foreignKey: "categoryId", as: "images" });

module.exports = LearningImage;
