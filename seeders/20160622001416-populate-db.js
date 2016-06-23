'use strict';

var faker = require('faker');
var bCrypt = require('bcrypt-nodejs');
var models = require('../models');

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomChoice(options) {
  return options[randomIntFromInterval(0, options.length - 1)].position;
}

function printObjectKeys(obj) {
  var lines = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      lines.push(key);
    }
  }
  console.log(lines.join('\n'));
}

function randomChoices(options) {
  var indexes = [];
  var choices = [];
  for (var i = 0; i < options.length; i++) indexes.push(i);
  var n = randomIntFromInterval(1, options.length);
  while(n-- > 0) {
    var i = randomIntFromInterval(0, indexes.length - 1);
    var index = indexes[i];
    indexes[i] = indexes[indexes.length - 1];
    indexes.length--;
    choices.push(options[index].position);
  }
  return choices;
}

function randomSurvey(id_course, id_user) {
  /** create knowledge areas for survey **/
  var kw_areas = [];
  var na = randomIntFromInterval(3, 8); // number of areas
  for (var i = 0; i < na; i++) {
    var kw_area = {
      name: faker.lorem.words(),
      position: i,
      questions: []
    };
    /** create questions for knowledge area **/
    var nq = randomIntFromInterval(4, 8); // number of questions
    for (var j = 0; j < nq; j++) {
      var question = {
        text: faker.lorem.sentence() + '?',
        type: randomIntFromInterval(1, 3),
        position: j,
        required: 1,
      };
      switch(question.type) {
        case 2:
        case 3:
          /** create options for question of type 2 or 3 **/
          question.opt_answers = [];
          var no = randomIntFromInterval(2,5); // number of options
          for (var k = 0; k < no; k++) {
            question.opt_answers.push({
              option: faker.lorem.sentence(),
              position: k,
            });
          }
          break;
      }
      kw_area.questions.push(question);
    }
    kw_areas.push(kw_area);
  }
  /** create survey **/
  var survey = {
    name: faker.lorem.sentence(),
    id_course: id_course,
    id_user: id_user,
    kw_areas: kw_areas,
    is_active: false,
  };
  // console.log(kw_areas);
  // console.log(survey);
  return survey;
}

function randomAnswerForSurvey(survey, id_student) {
  /** create kw_answers for survey's answer **/
  var kw_answers = [];
  survey.kw_areas.forEach(kw_area => {
    var kw_area_ans = {
      position: kw_area.position,
      answers: [],
    };
    kw_area.questions.forEach(question => {
      switch (question.type) {
        case 1: // free text
          kw_area_ans.answers.push({
            position: question.position,
            text: faker.lorem.paragraph(),
          });
          break;
        case 2: // single choice
          kw_area_ans.answers.push({
            position: question.position,
            choice: randomChoice(question.opt_answers),
          });
          break;
        default: // multichoice
          kw_area_ans.answers.push({
            position: question.position,
            choices: randomChoices(question.opt_answers),
          });
          break;
      }
    });
    kw_answers.push(kw_area_ans);
  });
  /** create survey answer **/
  var survey_answer = {
    id_survey: survey.id,
    id_student: id_student,
    feedback: faker.lorem.paragraph(),
    was_answered: true,
    was_open: true,
    kw_answers: kw_answers,
  };
  return survey_answer;
}

module.exports = {
  up: function (queryInterface, Sequelize) {

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
          var NUM_COURSES = 8;
          var coursePromises = [];
          for (var i = 0; i < NUM_COURSES; ++i) {
            coursePromises.push(
              models.Course.create({
                name: faker.company.companyName(),
                code: faker.address.zipCode(),
                id_user: user.id,
              })
              .then(course => {
                /*** create students for course ***/
                var studentCoursePromises = [];
                var NUM_STUDENTS = 20;
                for (var j = 0; j < NUM_STUDENTS; ++j) {
                  studentCoursePromises.push(
                    models.Student.create({
                      name: faker.name.findName(),
                      code: faker.address.zipCode(),
                      email: faker.internet.email()
                    }).then(student => models.StudentCourse.create({
                      CourseId: course.id,
                      StudentId: student.id,
                    }))
                  );
                }
                return Promise.all(studentCoursePromises)
                .then(studentCourses => {
                  /** create surveys for course **/
                  var NUM_SURVEYS = 2;
                  var surveyPromises = [];
                  for (var j = 0; j < NUM_SURVEYS; ++j) {
                    surveyPromises.push(
                      /** create survey **/
                      models.Survey.create(randomSurvey(course.id, user.id))
                      .then(survey => {
                        /** create answers for survey **/
                        var answerPromises = [];
                        for (var x = 0; x < studentCourses.length; ++x) {
                          answerPromises.push(
                            models.Answer.create(randomAnswerForSurvey(survey, studentCourses[x].StudentId))
                          );
                        }
                        return Promise.all(answerPromises);
                      })
                    );
                  }
                  return Promise.all(surveyPromises);
                })
                ;
              })
            );
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
