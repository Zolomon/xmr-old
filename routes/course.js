var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res) {
    models.Course.findAll().success(function(courses) {
        res.render('form', {
            title: 'Xmr'
        });
    });
});

router.get('/:course_id', function(req, res) {
    models.Course.find({
        where: {
            id: req.param('course_id')
        },
        include: [{
            model: models.Exam,
            include: [{
                model: models.Problem,
                include: [{
                    model: models.Answer
                }, {
                    model: models.Question
                }]
            }]
        }]
    }).success(function(course) {
        /*models.Exam.findAll({
            where: {
                CourseId: req.param('course_id')
            }
        }).success(function(exams) {
            console.log("Found exams: " + exams);
            exams.forEach(function(exam) {
                models.Problem.findAll({
                    where: {
                        ExamId: exam.id
                    }
                }).success(function(problems) {

                    res.render('course', {
                        course: course,
                        problems: problems
                    });
                });
            });
        });*/
        console.log(JSON.stringify(course));
        res.render('course', {
            course: course
        });

    });
});

router.post('/', function(req, res) {
    console.log(req);
    console.log(req.body);
    console.log(req.body.code);
    console.log(req.body.title);

    models.Course.create({
        code: req.body.code,
        title: req.body.title
    }).success(function(course) {
        console.log('Added: ' + course);
        res.redirect('/');
    });
});

module.exports = router;