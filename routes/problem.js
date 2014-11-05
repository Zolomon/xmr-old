var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var includes = require('../includes.js');

router.get('/:course_id/:exam_id/:problem_id', function(req, res) {
    models.Course.find({
        where: {
            id: req.param('course_id'),
            'Exams.id': req.param('exam_id'),
            'Exams.Problems.id': req.param('problem_id')
        },
        include: includes.Courses()
    }).success(function(course) {
        var exam = course.Exams[0];
        var problem = exam.Problems[0];

        res.render('problem', {
            course: course,
            exam: exam,
            problem: problem,
        });
    });
});

module.exports = router;