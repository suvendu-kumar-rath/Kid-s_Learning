const { LearningItem, Category, User, Pronunciation } = require("../model");
const { Op } = require('sequelize');
const HttpStatus = require("../enums/httpStatusCode.enum");

const itemController = {};

// Create a new learning item with image and voice
itemController.createItem = async (req, res) => {
  try {
    // Accept flexible field names from the client:
    // category (or categoryName), name (or itemName), photo (or image), voice (or record)
    const categoryName = req.body.category || req.body.categoryName;
    const itemName = req.body.name || req.body.itemName;
    const description = req.body.description || null;
    let userId = req.user && req.user.id;

    // Verify user exists; if not, store as null to avoid FK constraint errors
    if (userId) {
      const existingUser = await User.findByPk(userId);
      if (!existingUser) {
        userId = null;
      }
    }
    const isAdmin = req.user && req.user.role === 'admin';

    // Validate inputs
    if (!categoryName || !itemName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Both `category` and `name` fields are required'
      });
    }

    let category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
      category = await Category.create({ name: categoryName, isDefault: !!isAdmin });
    }

    // Support multiple upload field names for photo and voice
    const files = req.files || {};
    const photoFiles = files.photo || files.image || files.photoImage || null;
    const voiceFiles = files.voice || files.record || files.audio || null;

    // Photo is required
    if (!photoFiles || (Array.isArray(photoFiles) && photoFiles.length === 0)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Photo file is required (field name: `photo` or `image`)'
      });
    }

    // Build URLs from uploaded files (use first file if array)
    const imageFile = Array.isArray(photoFiles) ? photoFiles[0] : photoFiles;
    const imageUrl = `/uploads/images/${imageFile.filename}`;

    let voiceUrl = null;
    if (voiceFiles && (Array.isArray(voiceFiles) ? voiceFiles.length > 0 : true)) {
      const voiceFile = Array.isArray(voiceFiles) ? voiceFiles[0] : voiceFiles;
      voiceUrl = `/uploads/voice/${voiceFile.filename}`;
    }

    // Create learning item
    const newItem = await LearningItem.create({
      userId: isAdmin ? null : userId,
      categoryId: category.id,
      itemName,
      imageUrl,
      voiceUrl,
      description,
      isPublic: !!isAdmin
    });

    // Fetch the created item with associations
    const item = await LearningItem.findByPk(newItem.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'childName'] }
      ]
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Learning item created successfully',
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create learning item',
      error: error.message
    });
  }
};

// Get all items for a category
itemController.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user && req.user.id;

    // Validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get all items in this category
    const where = userId
      ? { categoryId, [Op.or]: [{ isPublic: true }, { userId }] }
      : { categoryId, isPublic: true };

    const items = await LearningItem.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'childName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Items retrieved successfully',
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve items',
      error: error.message
    });
  }
};

// Get my items
itemController.getMyItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await LearningItem.findAll({
      where: { userId, isPublic: false },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Your items retrieved successfully',
      data: items
    });
  } catch (error) {
    console.error('Get my items error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve your items',
      error: error.message
    });
  }
};

// Get single item details
itemController.getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await LearningItem.findByPk(itemId, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'childName'] },
        { model: Pronunciation, as: 'pronunciation', attributes: ['id', 'audioUrl', 'language'] }
      ]
    });

    if (!item) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Item not found'
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Item retrieved successfully',
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve item',
      error: error.message
    });
  }
};

// Update an existing learning item (owner or admin)
itemController.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const requesterId = req.user && req.user.id;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.isAdmin === true);

    const item = await LearningItem.findByPk(itemId);
    if (!item) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Item not found' });
    }

    // Authorization: owner or admin
    if (!isAdmin && requesterId && item.userId && parseInt(requesterId, 10) !== parseInt(item.userId, 10)) {
      return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'Not authorized to update this item' });
    }

    // Accept flexible inputs for category/name/description
    const categoryName = req.body.category || req.body.categoryName;
    const categoryId = req.body.categoryId || null;
    const itemName = req.body.name || req.body.itemName || item.itemName;
    const description = req.body.description !== undefined ? req.body.description : item.description;

    // Resolve or create category if provided
    let newCategoryId = item.categoryId;
    if (categoryId) {
      const existingCategory = await Category.findByPk(categoryId);
      if (!existingCategory) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Provided categoryId does not exist' });
      }
      newCategoryId = existingCategory.id;
    } else if (categoryName) {
      let category = await Category.findOne({ where: { name: categoryName } });
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
      newCategoryId = category.id;
    }

    // Handle uploaded files
    const files = req.files || {};
    const photoFiles = files.photo || files.image || files.photoImage || null;
    const voiceFiles = files.voice || files.record || files.audio || null;

    if (photoFiles && (Array.isArray(photoFiles) ? photoFiles.length > 0 : true)) {
      const imageFile = Array.isArray(photoFiles) ? photoFiles[0] : photoFiles;
      item.imageUrl = `/uploads/images/${imageFile.filename}`;
    }

    if (voiceFiles && (Array.isArray(voiceFiles) ? voiceFiles.length > 0 : true)) {
      const voiceFile = Array.isArray(voiceFiles) ? voiceFiles[0] : voiceFiles;
      item.voiceUrl = `/uploads/voice/${voiceFile.filename}`;
    }

    // Update fields
    item.itemName = itemName;
    item.description = description;
    item.categoryId = newCategoryId;

    await item.save();

    const updated = await LearningItem.findByPk(item.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'childName'] }
      ]
    });

    return res.status(HttpStatus.OK).json({ success: true, message: 'Item updated successfully', data: updated });
  } catch (error) {
    console.error('Update item error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to update item', error: error.message });
  }
};

module.exports = itemController;
