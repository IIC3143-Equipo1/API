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
              unique: 'student_survey_key',
              references: { 
                model: "Students", 
                key:   "id" }
            },
    id_survey: {
              type: DataTypes.INTEGER,
              unique: 'student_survey_key',
              references: { 
                model: "Surveys", 
                key:   "id" }
            },
    kw_answers: DataTypes.ARRAY(DataTypes.JSON),
    feedback: {
      type: DataTypes.TEXT
    },
    was_answered:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    was_open:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
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
