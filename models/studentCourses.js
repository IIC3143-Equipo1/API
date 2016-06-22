'use strict';
module.exports = function(sequelize, DataTypes) {
  var StudentCourses = sequelize.define('StudentCourse', {
    status: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.StudentCourse.belongsTo(models.Student);
        models.StudentCourse.belongsTo(models.Course);
      }
    }
  });
  return StudentCourses;
};
