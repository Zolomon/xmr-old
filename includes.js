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
                model: models.Tag
            }]
        }]
    }];
};

module.exports = new Include();