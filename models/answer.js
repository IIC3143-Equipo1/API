'use strict';
module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_student: {
              type: DataTypes.INTEGER,
              references: 'Students', 
              referencesKey: 'id'
            },
    id_survey: {
              type: DataTypes.INTEGER,
              references: 'Surveys', 
              referencesKey: 'id'
            },
    kw_answers: DataTypes.ARRAY(DataTypes.JSON)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Answer.belongsTo(models.Student,{foreignKey: 'id_student'});
        models.Answer.belongsTo(models.Survey,{foreignKey: 'id_survey'});
      }
    }
  });
  return Answer;
};
