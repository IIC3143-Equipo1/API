'use strict';
module.exports = {
  up: function(queryInterface, Sequelize)
  {
    return queryInterface.createTable('Surveys',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        kw_areas: {
          type: Sequelize.ARRAY(Sequelize.JSON)
        },
        id_course: {
          type: Sequelize.INTEGER
        },
        id_user:{
          type:Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      }
    );
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Surveys');
  }
};
'use strict';
