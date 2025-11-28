const { Category, LearningItem, Pronunciation } = require("../model");

async function seedDefaultData() {
  try {
    // Check if categories already exist
    const existingCategories = await Category.count();
    if (existingCategories > 0) {
      console.log("Default data already seeded. Skipping...");
      return;
    }

    console.log("Seeding default categories and images...");

    // Create default categories
    const animalsCategory = await Category.create({
      name: "Animals",
      description: "Learn names of different animals",
      isDefault: true,
    });

    const fruitsCategory = await Category.create({
      name: "Fruits",
      description: "Learn names of different fruits",
      isDefault: true,
    });

    const familyCategory = await Category.create({
      name: "Family Members",
      description: "Learn family member names",
      isDefault: true,
    });

    const colorsCategory = await Category.create({
      name: "Colors",
      description: "Learn different colors",
      isDefault: true,
    });

    // Create default images for Animals
    const animalImages = [
      { name: "Apple", categoryId: fruitsCategory.id },
      { name: "Banana", categoryId: fruitsCategory.id },
      { name: "Orange", categoryId: fruitsCategory.id },
      { name: "Cat", categoryId: animalsCategory.id },
      { name: "Dog", categoryId: animalsCategory.id },
      { name: "Bird", categoryId: animalsCategory.id },
      { name: "Fish", categoryId: animalsCategory.id },
      { name: "Mother", categoryId: familyCategory.id },
      { name: "Father", categoryId: familyCategory.id },
      { name: "Sister", categoryId: familyCategory.id },
      { name: "Brother", categoryId: familyCategory.id },
      { name: "Red", categoryId: colorsCategory.id },
      { name: "Blue", categoryId: colorsCategory.id },
      { name: "Green", categoryId: colorsCategory.id },
    ];

    // Create images and pronunciations
    for (const imageData of animalImages) {
      const image = await LearningItem.create({
        categoryId: imageData.categoryId,
        name: imageData.name,
        description: `Learn the word: ${imageData.name}`,
        imagePath: `/uploads/learning-images/default-${imageData.name.toLowerCase()}.jpg`,
        isDefault: true,
      });

      // Create pronunciation for each image
      await Pronunciation.create({
        imageId: image.id,
        text: imageData.name,
        language: "en",
        isDefault: true,
      });
    }

    console.log("Default data seeded successfully!");
  } catch (error) {
    console.error("Error seeding default data:", error);
    throw error;
  }
}

module.exports = seedDefaultData;
