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
    id_user: DataTypes.INTEGER,
    kw_areas: DataTypes.ARRAY(DataTypes.JSON),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Survey.hasMany(models.Answer,{foreignKey:'id_survey'});
        models.Survey.belongsTo(models.Course,{foreignKey:'id_course'});
      }
    }
  });
  return Survey;
};
