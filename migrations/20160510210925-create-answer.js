'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_survey: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_student: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      kw_answers: {
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Answers');
  }
};
