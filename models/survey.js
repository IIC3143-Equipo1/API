'use strict';
module.exports = function(sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    id_course: DataTypes.INTEGER,
    kw_areas: DataTypes.ARRAY(DataTypes.JSON)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Survey;
};
