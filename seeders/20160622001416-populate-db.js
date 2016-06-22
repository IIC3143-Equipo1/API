'use strict';

var faker = require('faker');
var bCrypt = require('bcrypt-nodejs');
var models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   return Promise.all(
     /**** create users ****/
     [{
       username: 'pablo',
       firstName: 'Pablo',
       lastName: 'Messina',
       password: bCrypt.hashSync('pass', bCrypt.genSaltSync(10), null),
       email: 'pamessina@uc.cl',
     }].map(userParams =>
       models.User.create(userParams).then(user => {
         /**** create courses for user ****/
         var NUM_COURSES = 10;
         var coursePromises = [];
         for (var i = 0; i < NUM_COURSES; ++i) {
           coursePromises.push(models.Course.create({
             name: faker.company.companyName(),
             code: faker.address.zipCode(),
             id_user: user.id,
           }).then(course => {
             /*** create students for course ***/
             var studentPromises = [];
             var NUM_STUDENTS = 50;
             for (var j = 0; j < NUM_STUDENTS; ++j) {
               var now = new Date();
               studentPromises.push(models.Student.create({
                 name: faker.name.findName(),
                 code: faker.address.zipCode(),
                 email: faker.internet.email(),
                 createdAt: now,
                 updatedAt: now
               }).then(student => models.StudentCourse.create({
                 CourseId: course.id,
                 StudentId: student.id
               })));
             }
             return Promise.all(studentPromises);
           }));
         }
         return Promise.all(coursePromises);
       })
     )
   );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Students', null, {});
  }
};
