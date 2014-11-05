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

router.get('/:exam_id', function(req, res) {
    models.Course.findAll({
        where: {
            'Exams.id': req.param('exam_id')
        },
        include: include.Courses()
    }).success(function(courses) {
        console.log(courses);
        res.render('exam', {
            courses: courses
        });
    });
});

module.exports = router;