'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('Course', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      code: {
        type: DataTypes.STRING
      },
      id_user:{
        type: DataTypes.INTEGER
      }
  }, {
    classMethods: {
      associate: function(models) {
        //,foreignKey: 'course_id' 
       models.Course.belongsToMany(models.Student, { through: models.StudentCourse });
      }
    }
  });
  return Course;
};
