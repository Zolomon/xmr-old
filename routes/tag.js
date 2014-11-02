var models = require('../models'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    slugger = require('slug'),
    includes = require('../includes.js'),
    _ = require('lodash');

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

router.get('/:tag_slug', function(req, res) {
    models.Course.findAll({
        where: {
            'Exams.Problems.TagLinks.Tag.slug': req.param('tag_slug')
        },
        include: includes.Courses()
    }).success(function(courses) {
        /*courses.forEach(function(course) {
            console.log(course.title);
        });*/
        console.log(courses.length);
        console.log(JSON.stringify(courses, null, 4));
        models.Tag.find({
            where: {
                slug: req.param('tag_slug')
            }
        }).success(function(theTag) {

            /*courses = _.where(courses, function(course) {
                return course.Exams && course.Exams.Problems;
            });*/

            console.log(courses);

/*            courses.forEach(function (course) {
                if (course && course.Exams) {
                    course.Exams.forEach(function(exam) {
                        if (exam && exam.Problems) {
                            exam.Problems.forEach(function(problem) {
                                console.log(problem);
                            });
                        }
                    });
                }
            });*/
            
            res.render('problems_by_tag', {
                courses: courses,
                tag: theTag
            });
        });
    });
});

router.get('/remove/:taglink_id', function(req, res) {
    models.TagLink.find({
        where: {
            id: Number(req.param('taglink_id'))
        }
    }).success(function(taglink) {
        console.log(taglink);

        if (taglink !== null) {
            taglink.destroy().success(function() {
                res.redirect('back');
            });
        }
        res.redirect('back');
    }).error(function(err) {
        if (err)
            res.render('error', {
                message: err.message,
                error: err
            });
    });
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
        // Check if tag already exists
        models.Tag.find({
            where: {
                slug: theSlug
            }
        }).success(function(tag) {
            // If not, create it
            if (tag === null) {
                models.Tag.create({
                    title: req.body.tag,
                    slug: theSlug,
                }).success(function(theTag) {
                    tag = theTag;

                    tag.setCourse(course);
                    tag.setExam(course.Exams[0]);
                    tag.setProblem(course.Exams[0].Problems[0]);

                    models.TagLink.create({
                        title: tag.title
                    }).success(function(taglink) {
                        taglink.setTag(tag);
                        taglink.setProblem(course.Exams[0].Problems[0]);
                        res.redirect('back');
                    });
                });
            } else {
                models.TagLink.create({
                    title: tag.title
                }).success(function(taglink) {
                    taglink.setTag(tag);
                    taglink.setProblem(course.Exams[0].Problems[0]);
                    res.redirect('back');
                });
            }
        });
    });
});

module.exports = router;