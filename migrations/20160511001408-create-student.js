'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      }
    });
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('Students');
  }
};
