const { Pronunciation, LearningImage } = require("../model");
const HttpStatus = require("../enums/httpStatusCode.enum");
const ResponseMessages = require("../enums/responseMessages.enum");

const pronunciationController = {};

// Get pronunciation for an image
pronunciationController.getPronunciation = async (req, res) => {
  try {
    const { imageId } = req.params;

    const pronunciations = await Pronunciation.findAll({
      where: { imageId },
      order: [["createdAt", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.FETCH,
      { pronunciations }
    );
  } catch (error) {
    console.error("Error fetching pronunciation:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to fetch pronunciation",
      error.message
    );
  }
};

// Add pronunciation to image (support for text-to-speech generation or pre-recorded audio)
pronunciationController.createPronunciation = async (req, res) => {
  try {
    const { imageId, text, language } = req.body;

    if (!imageId || !text) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        "Image ID and pronunciation text are required"
      );
    }

    // Verify image exists
    const image = await LearningImage.findByPk(imageId);
    if (!image) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        "Image not found"
      );
    }

    // Handle optional audio file upload
    let audioUrl = null;
    if (req.file) {
      audioUrl = `/uploads/pronunciations/${req.file.filename}`;
    }

    const pronunciation = await Pronunciation.create({
      imageId,
      text,
      audioUrl,
      language: language || "en",
      isDefault: false,
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      ResponseMessages.CREATE_SUCCESS,
      { pronunciation }
    );
  } catch (error) {
    console.error("Error creating pronunciation:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to create pronunciation",
      error.message
    );
  }
};

// Update pronunciation
pronunciationController.updatePronunciation = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, language } = req.body;

    const pronunciation = await Pronunciation.findByPk(id);
    if (!pronunciation) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.NOT_FOUND
      );
    }

    if (text) pronunciation.text = text;
    if (language) pronunciation.language = language;
    if (req.file) pronunciation.audioUrl = `/uploads/pronunciations/${req.file.filename}`;

    await pronunciation.save();

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.UPDATE,
      { pronunciation }
    );
  } catch (error) {
    console.error("Error updating pronunciation:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to update pronunciation",
      error.message
    );
  }
};

// Delete pronunciation
pronunciationController.deletePronunciation = async (req, res) => {
  try {
    const { id } = req.params;

    const pronunciation = await Pronunciation.findByPk(id);
    if (!pronunciation) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.NOT_FOUND
      );
    }

    await pronunciation.destroy();

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DELETE,
      {}
    );
  } catch (error) {
    console.error("Error deleting pronunciation:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to delete pronunciation",
      error.message
    );
  }
};

module.exports = pronunciationController;
