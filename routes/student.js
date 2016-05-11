var models = require('../models');

exports.createStudent = function(req, res) {
  models.Student.create({
    name: req.body.name,
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
    //attributes: { include: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total']] },
    //group: [models.sequelize.col('id')]
  }).then(function(students) {
      students.current_page = parseInt(req.query.page,10);
      res.json(students);
  });
};

// get single student
exports.getStudent = function(req, res) {
  models.Student.find({
    where: {
      id: req.params.id
    }
  }).then(function(student) {
    res.json(student);
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
        email:req.body.email
      }).then(function(student) {
        res.send(student);
      });
    }
  });
};
