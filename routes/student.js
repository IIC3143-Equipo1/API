var models = require('../models');

exports.createStudent = function(req, res) {
  models.Student.create({
    name: req.body.name,
    code: req.body.code,
    email: req.body.email
  }).then(function(student) {
    res.json(student);
  });
};

// get all students
exports.allStudents = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Student.findAndCountAll({
    order: 'id ASC',
    limit: 5,
    offset: page || 0
  }).then(function(students) {
      students.current_page = parseInt(req.query.page,10);
      res.json(students);
  });
};

// get single student
exports.getStudent = function(req, res) {
  models.Student.find({
      include: [models.StudentCourse,models.Course],
    where: {
      id: req.params.id
    }
  }).then(function(student) {
    res.json(student);
  });
};

// get students by course
exports.getStudentsByCourse = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Student.findAndCountAll({
    order: 'id ASC',
    limit: 5,
    offset: page || 0,
    include: [{
      model: models.StudentCourse,
      where: { CourseId: req.query.id_course }
    },
    {
      model:models.Answer
    }
    ]
  }).then(function(students) {
    students.current_page = parseInt(req.query.page,10);
    res.json(students);
  });
};

// save students by course
exports.saveStudentCourse = function(req, res) {
  models.StudentCourse.create({
    CourseId: req.body.id_course,
    StudentId: req.body.id_student
  }).then(function(student_course) {
    res.json(student_course);
  });
};

// delete a student course
exports.deleteStudentCourse = function(req, res) {
  models.StudentCourse.destroy({
    where: {
      CourseId: req.query.id_course,
      StudentId: req.query.id_student
    }
  }).then(function(student_course) {
    res.json(student_course);
  });
};



// delete a single student
exports.deleteStudent = function(req, res) {
  models.Student.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(student) {
    res.json(student);
  });
};

// update single student
exports.updateStudent = function(req, res) {
  models.Student.find({
    where: {
      id: req.params.id
    }
  }).then(function(student) {
    if(student){
      student.updateAttributes({
        name: req.body.name,
        code: req.body.code,
        email:req.body.email
      }).then(function(student) {
        res.send(student);
      });
    }
  });
};
