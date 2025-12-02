const { Category, LearningItem, } = require("../model");
const HttpStatus = require("../enums/httpStatusCode.enum");
const ResponseMessages = require("../enums/responseMessages.enum");

const categoryController = {};

// Get all categories (both default and custom)
categoryController.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: require("../model").LearningItem,
          as: "items",
          attributes: ["id", "itemName", "imageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.FETCH,
      { categories }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to fetch categories",
      error.message
    );
  }
};

// Get category by ID with all items and pronunciations
categoryController.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: LearningItem,
          as: 'items',
          attributes: ['id', 'itemName', 'imageUrl', 'voiceUrl', 'description', 'isPublic', 'userId']
        }
      ]
    });

    if (!category) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.NOT_FOUND
      );
    }

    return res.success(HttpStatus.OK, true, ResponseMessages.FETCH, {
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to fetch category",
      error.message
    );
  }
};

// Create a new category (for users to add custom categories)
categoryController.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        "Category name is required"
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.error(
        HttpStatus.CONFLICT,
        false,
        "Category already exists"
      );
    }

    const category = await Category.create({
      name,
      description,
      isDefault: false,
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      ResponseMessages.CREATE_SUCCESS,
      { category }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to create category",
      error.message
    );
  }
};

// Update category
categoryController.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.NOT_FOUND
      );
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.UPDATE,
      { category }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to update category",
      error.message
    );
  }
};

// Delete category
categoryController.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.NOT_FOUND
      );
    }

    await category.destroy();

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DELETE,
      {}
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to delete category",
      error.message
    );
  }
};

module.exports = categoryController;
