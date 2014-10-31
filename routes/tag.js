var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var slug = require('slug');

router.get('/', function(req, res) {
	res.redirect('/tag/all');
});

router.get('/all', function(req, res) {
	models.Problem.findAll().success(function(tags) {
		res.render('all_tags', {
			tags: tags
		});
	});
});

router.post('/add', function(req, res) {
	models.Tag.create({
		ProblemId: Number(req.body.problem_id),
		title: req.body.tag,
		slug: slug(req.body.tag)
	}).success(function (tag) {
		console.log(slug(req.body.tag));
		res.redirect('back');
	});
});

module.exports = router;