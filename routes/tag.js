var models = require('../models'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    slugger = require('slug'),
    includes = require('../includes.js');

router.get('/', function(req, res) {
    res.redirect('/tag/all');
});

router.get('/all', function(req, res) {
    models.Tag.findAll().success(function(tags) {
        res.render('all_tags', {
            tags: tags
        });
    });
});

router.get('/remove/:problem_id/:tag_id', function(req, res) {
    models.Tag.find({
        where: {
            id: Number(req.param('tag_id'))
        }
    })
});


router.get('/destroy/:tag_id', function(req, res) {
    console.log(req.param('tag_id'));
    models.Tag.find({
        where: {
            id: Number(req.param('tag_id'))
        }
    }).success(function(theTag) {
        theTag.destroy().success(function() {
            res.redirect('back');
        });
    });
});

router.post('/add', function(req, res) {
    var theSlug = slugger(req.body.tag);

    models.Course.find({
        where: {
            id: Number(req.body.course_id),
            'Exams.id': Number(req.body.exam_id),
            'Exams.Problems.id': Number(req.body.problem_id),
        },
        include: includes.Courses()
    }).success(function(course) {
        models.Tag.create({
            title: req.body.tag,
            slug: theSlug,
        }).success(function(tag) {
            tag.setCourse(course);
            tag.setExam(course.Exams[0]);
            tag.setProblem(course.Exams[0].Problems[0]);

            console.log(theSlug);
            res.redirect('back');
        });
    });
});

module.exports = router;