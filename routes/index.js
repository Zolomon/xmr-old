var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    models.Course.findAll({
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
    }).success(function(courses) {
        console.log(courses);
        res.render('index', {
            title: 'Xmr',
            courses: courses
        });
    });
});

module.exports = router;