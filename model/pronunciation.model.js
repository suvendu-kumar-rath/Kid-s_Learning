const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LearningImage = require("./learningImage.model");

const Pronunciation = sequelize.define(
  "Pronunciation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "learning_images",
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false, // The word text: e.g., "Apple"
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true, // URL or path to pre-recorded audio file (optional)
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "en", // Language code (en, es, fr, etc.)
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // true for system default pronunciations
    },
  },
  {
    tableName: "pronunciations",
    timestamps: true,
  }
);

Pronunciation.belongsTo(LearningImage, { foreignKey: "imageId", as: "image" });
LearningImage.hasMany(Pronunciation, { foreignKey: "imageId", as: "pronunciations" });

module.exports = Pronunciation;
