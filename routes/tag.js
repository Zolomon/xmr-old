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
    models.Course.findAll({
        include: includes.Courses()
    }).success(function(courses) {
        // Create a structure like:
        // [
        //   { course: course,
        //     TagLinks: [{taglink: taglink, count: count}] 
        //   },
        // ]
        courses = _.map(courses, function(course) {
            var hashmap = {};

            if (course.Exams) {
                return {
                    course: course,
                    TagLinks: _.uniq(_.sortBy(
                        _.map(
                            _.flatten(
                                _.map(course.Exams, function flattenExam(exam) {
                                    if (exam.Problems) {
                                        // For each exam, flatten problems
                                        return _.flatten(_.map(exam.Problems, function(problem) {
                                            return problem.TagLinks;
                                        }));
                                    }
                                    return undefined;
                                })),
                            function addCount(taglink) {
                                if (taglink.Tag &&
                                    taglink.Tag.id) {
                                    if (taglink.Tag.id in hashmap) {
                                        hashmap[taglink.Tag.id] += 1;
                                    } else {
                                        hashmap[taglink.Tag.id] = 1;
                                    }
                                } else {
                                    console.log("Hashmap error?");
                                }

                                return {
                                    'taglink': taglink,
                                    'count': hashmap[taglink.Tag.id]
                                };
                            }
                        ), function sortInDescendingOrder(object) {
                            return -object.count;
                        }), function findUnique(object) {
                        return object.taglink.Tag.id;
                    })
                };
            }
            return {
                course: course,
                TagLinks: undefined
            };
        });
        res.render('all_tags', {
            courses: courses
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
        models.Tag.find({
            where: {
                slug: req.param('tag_slug')
            }
        }).success(function(theTag) {
            res.render('problems_by_tag', {
                courses: courses,
                tag: theTag
            });
        });
    });
});

router.get('/:tag_slug/solution', function (req, res) {
    models.Course.findAll({
        where: {
            'Exams.Problems.TagLinks.Tag.slug': req.param('tag_slug'),
            'Exams.Problems.TagLinks.Tag.slug': 'losning',
        },
        include: includes.Courses()
    }).success(function (courses) {
        models.Tag.find({
            where: {
                slug: req.param('tag_slug')
            }
        }).success(function(theTag) {
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
    // Destroy all links
    models.TagLink.findAll({
        where: {
            'Tag.id': req.param('tag_id')
        },
        include: [{
            model: models.Tag
        }]
    }).success(function(taglinks) {
        taglinks.forEach(function(taglink) {
            models.TagLink.find({
                where: {
                    id: taglink.id
                }
            }).success(function(taglink) {
                taglink.destroy().sucess(function() {
                    console.log('Removed taglink for ' + taglink.Tag.slug);
                });
            });
        });
    });

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

router.get('/rename/:tag_slug', function(req, res) {
    models.Tag.find({
        where: {
            slug: req.param('tag_slug')
        }
    }).success(function(tag) {
        res.render('rename_tag', {
            tag: tag
        });
    });
});

router.post('/rename', function(req, res) {
    models.Tag.find({
        where: {
            id: req.body.id
        }
    }).success(function(tag) {
        tag.updateAttributes({
            slug: slugger(req.body.tag)
        }).success(function() {
            res.redirect('/tag/all');
        });
    });
});

module.exports = router;