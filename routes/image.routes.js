const express = require('express');
const router = express.Router();
const itemController = require('../controllers/image.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const optionalAuth = require('../middlewares/optionalAuth.middleware');

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

// Update learning item (user or admin)
router.put(
  '/:itemId',
  authMiddleware,
  upload('learning-items').fields([
    { name: 'image', maxCount: 1 },
    { name: 'voice', maxCount: 1 }
  ]),
  itemController.updateItem
);

// Get my items (requires auth)
router.get('/my-items', authMiddleware, itemController.getMyItems);

// Get single item
router.get('/:itemId', itemController.getItemById);


module.exports = router;
