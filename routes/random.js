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
            id: req.param('course_id')
            //,
            //'Exam.id': req.param('exam_id'),
            //'Problem.index': req.param('problem_index')
        },
        /*include: [{
            model: models.Exam,
            as: 'Exam',
            include: [{
                model: models.Problem,
                as: 'Problem',
                include: [{
                    model: models.Answer
                }, {
                    model: models.Question
                }]
            }]
        }]*/
        include: includes.Courses()
    }).success(function(course) {
        //var exam = _.sample(course.Exams);
        var exam = _.where(course.Exams, {
            'id': req.param('exam_id')
        })[0];

        console.log(exam);
        var problem = _.where(exam.Problems, {
            'id': req.param('problem_index')
        })[0];

        console.log(exam);
        console.log(problem);
        console.log(problem.Question);
        console.log(problem.Answer);

        res.render('problem', {
            course: course,
            exam: exam,
            problem: problem,
        });
    });
});

module.exports = router;