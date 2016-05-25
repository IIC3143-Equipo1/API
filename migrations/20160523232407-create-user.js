'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
       firstname: {
        type: Sequelize.STRING
      },
       lastname: {
        type: Sequelize.STRING
      },
       password: {
        type: Sequelize.STRING
      },
       email: {
        type: Sequelize.STRING
      },
    });
  },
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
