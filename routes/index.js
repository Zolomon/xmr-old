var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	models.Course.findAll().success(function (courses) {
		res.render('index', {
			title: 'Xmr',
			courses: courses,
			length: courses.length
		});
	});
});

module.exports = router;
