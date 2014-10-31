var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var includes = require('../includes.js');
var _ = require('lodash');

router.get('/:course_id/problem/', function(req, res) {
    console.log(req.param('course_id'));

    models.Course.find({
        where: {
            id: req.param('course_id')
        },
        include: includes.Courses()
    }).success(function(course) {
        console.log(course);
        var exam = _.sample(course.Exams);
        var problem = _.sample(exam.Problems);

        res.redirect('/random/' + course.id + '/exam/' + exam.id + '/problem/' + problem.index);

        /*		res.render('problem', {
			course: course,
			exam: exam,
			problem: problem
		});*/
    });
});

router.get('/:course_id/exam/:exam_id/problem/:problem_index', function(req, res) {
    models.Course.find({
        where: {
            id: req.param('course_id'),
            'Exams.id': req.param('exam_id'),
            'Exams.Problems.index': req.param('problem_index')
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