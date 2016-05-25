'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      email:{
        type: DataTypes.STRING
      }
  }, {
    classMethods: {
      associate: function(models) {
       models.User.hasMany(models.Survey, { foreignKey: 'id_user'  });
      }
    }
  });
  return User;
};
