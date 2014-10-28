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

        models.Course.findAll().success(function(courses) {
            res.render('index', {
                title: 'Xmr',
                courses: courses,
                length: courses.length
            });
        });
    });
});

module.exports = router;