  'use strict';
module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define('Student', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      code:{
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      }
  }, {
    classMethods: {
      associate: function(models) {
         models.Student.hasMany(models.StudentCourse,{foreignKey:'StudentId'});
         models.Student.hasMany(models.Answer,{foreignKey:'id_student'});
         //,foreignKey: 'student_id'  
         models.Student.belongsToMany(models.Course, { through: models.StudentCourse });
      }
    }
  });
  return Student;
};