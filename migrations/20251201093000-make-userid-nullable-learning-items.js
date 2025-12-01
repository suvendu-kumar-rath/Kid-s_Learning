"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make userId nullable and set ON DELETE to SET NULL to avoid insert failures
    await queryInterface.changeColumn('learning_items', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to NOT NULL and ON DELETE CASCADE (original behaviour)
    await queryInterface.changeColumn('learning_items', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
