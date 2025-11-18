const User = require("./user.model");
const Category = require("./category.model");
const LearningItem = require("./learningItem.model");
const Pronunciation = require("./pronunciation.model");

// Associations
User.hasMany(LearningItem, { foreignKey: "userId", as: "items", onDelete: "CASCADE" });
LearningItem.belongsTo(User, { foreignKey: "userId", as: "user" });

Category.hasMany(LearningItem, { foreignKey: "categoryId", as: "items", onDelete: "CASCADE" });
LearningItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

LearningItem.hasOne(Pronunciation, { foreignKey: "itemId", as: "pronunciation", onDelete: "CASCADE" });
Pronunciation.belongsTo(LearningItem, { foreignKey: "itemId" });

module.exports = {
  User,
  Category,
  LearningItem,
  Pronunciation,
};
