var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var includes = require('../includes.js');

router.get('/:course_id/:exam_id/:problem_id', function(req, res) {
    /*models.Problem.find({
        where: {
            'id': req.param('problem_id')
        },
        include: [{
            model: models.Question
        }, {
            model: models.Answer
        }, {
            model: models.TagLink,
            include: [{
                model: models.Problem
            }, {
                model: models.Tag
            }]
        }],
    }).success(function(problem) {
        models.Exam.findAll({
            where: {
                'Problems.id': req.param('problem_id')
            },
            include: [{
                model: models.Problem,
                include: [{
                    model: models.Question
                }, {
                    model: models.Answer
                }, {
                    model: models.TagLink,
                    include: [{
                        model: models.Problem
                    }, {
                        model: models.Tag
                    }]
                }]
            }]
        }).success(function(exam) {
            models.Course.findAll({
                where: {
                    'Exams.id': exam.id
                },
                include: models.Exam
            }).success(function(course) {
                console.log('course ' + course);
                console.log('course .id' + course[0].id);
                console.log('exam ' + exam);
                console.log('exam .id' + exam[0].id);
                console.log('problem ' + problem);
                console.log('taglinks' + problem.TagLinks)

                res.render('problem', {
                    course: course,
                    exam: exam,
                    problem: problem
                });
            });
        });
    });*/

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