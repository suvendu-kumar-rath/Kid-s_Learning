const express = require("express");
const router = express.Router();
const pronunciationController = require("../controllers/pronunciation.controller");
const upload = require("../middlewares/upload.middleware");

// Get pronunciation for an image
router.get("/:imageId", pronunciationController.getPronunciation);

// Create new pronunciation (with optional audio file upload)
router.post(
  "/",
  upload("pronunciations").single("audio"),
  pronunciationController.createPronunciation
);

// Update pronunciation
router.put(
  "/:id",
  upload("pronunciations").single("audio"),
  pronunciationController.updatePronunciation
);

// Delete pronunciation
router.delete("/:id", pronunciationController.deletePronunciation);

module.exports = router;
