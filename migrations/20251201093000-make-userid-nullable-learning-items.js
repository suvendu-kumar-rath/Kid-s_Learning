"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove any existing foreign key constraint on userId, then change column and re-add FK
    const [[fkRow]] = await queryInterface.sequelize.query(
      `SELECT CONSTRAINT_NAME as constraintName
       FROM information_schema.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'learning_items'
         AND COLUMN_NAME = 'userId'
         AND REFERENCED_TABLE_NAME = 'users'
       LIMIT 1;`
    );

    if (fkRow && fkRow.constraintName) {
      try {
        await queryInterface.removeConstraint('learning_items', fkRow.constraintName);
      } catch (err) {
        // ignore if cannot remove
        console.warn('Could not remove existing FK constraint', fkRow.constraintName, err.message);
      }
    }

    // Change column to allow NULL
    await queryInterface.changeColumn('learning_items', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Recreate foreign key with ON DELETE SET NULL
    await queryInterface.addConstraint('learning_items', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_learning_items_userId_users_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove our FK if present
    try {
      await queryInterface.removeConstraint('learning_items', 'fk_learning_items_userId_users_id');
    } catch (e) {
      // ignore
    }

    // Change column back to NOT NULL
    await queryInterface.changeColumn('learning_items', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // Recreate original FK with ON DELETE CASCADE
    await queryInterface.addConstraint('learning_items', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_learning_items_userId_users_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
