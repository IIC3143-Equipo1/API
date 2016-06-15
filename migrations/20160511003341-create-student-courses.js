'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('StudentCourses', {
      status: {
        type: Sequelize.INTEGER
      }
    });
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('StudentCourses');
  }
};
