'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      id_user:{
        type: Sequelize.INTEGER
      }
    });
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('Students');
  }
};
