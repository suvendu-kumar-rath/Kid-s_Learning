const User = require("./user.model");
const Category = require("./category.model");
const LearningItem = require("./learningItem.model");

// Associations
User.hasMany(LearningItem, { foreignKey: "userId", as: "items", onDelete: "CASCADE" });
LearningItem.belongsTo(User, { foreignKey: "userId", as: "user" });

Category.hasMany(LearningItem, { foreignKey: "categoryId", as: "items", onDelete: "CASCADE" });
LearningItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });


module.exports = {
  User,
  Category,
  LearningItem,
  
};
