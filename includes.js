var models = require('./models');

var Include = function() {};

Include.prototype.Courses = function() {
    return [{
        model: models.Exam,
        include: [{
            model: models.Problem,
            include: [{
                model: models.Answer
            }, {
                model: models.Question
            }, {
                model: models.TagLink,
                include: [{
                    model: models.Tag
                }, {
                    model: models.Problem
                }]
            }]
        }]
    }];
};

module.exports = new Include();