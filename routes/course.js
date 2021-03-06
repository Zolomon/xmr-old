var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var include = require('../includes.js');

/* GET home page. */
router.get('/', function(req, res) {
    models.Course.findAll().success(function(courses) {
        res.redirect('/');
    });
});

router.get('/:course_id', function(req, res) {
    models.Course.find({
        where: {
            id: req.param('course_id')
        },
        include: include.Courses()
    }).success(function(course) {
        res.render('course', {
            course: course
        });
    });
});

router.get('/:course_id/:exam_index', function(req, res) {
    models.Course.find({
        where: {
            id: req.param('course_id')
        },
        include: include.Courses()
    }).success(function(course) {
        // Validate parameters
        res.render('exam', {
            course: course,
            exam: course.Exams[Number(req.param('exam_index')) - 1]
        });
    });
});

router.post('/', function(req, res) {
    models.Course.create({
        code: req.body.code,
        title: req.body.title
    }).success(function(course) {
        res.redirect('/');
    });
});

module.exports = router;