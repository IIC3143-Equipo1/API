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
      }
  }, {
    classMethods: {
      associate: function(models) {
       models.Course.belongsToMany(models.Student, { through: models.StudentCourse });
      }
    }
  });
  return Course;
};
