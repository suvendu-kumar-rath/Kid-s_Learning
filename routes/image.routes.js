const express = require('express');
const router = express.Router();
const itemController = require('../controllers/image.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Create learning item (requires auth, image+voice upload)
router.post(
  '/create',
  authMiddleware,
  upload('learning-items').fields([
    { name: 'image', maxCount: 1 },
    { name: 'voice', maxCount: 1 }
  ]),
  itemController.createItem
);

// Get items by category
router.get('/category/:categoryId', itemController.getItemsByCategory);

// Get my items (requires auth)
router.get('/my-items', authMiddleware, itemController.getMyItems);

// Get single item
router.get('/:itemId', itemController.getItemById);

module.exports = router;
