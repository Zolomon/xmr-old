var models = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

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

module.exports = router;