'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Studentcourses', {
      status: {
        type: Sequelize.INTEGER
      }
    });
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('Studentcourses');
  }
};
