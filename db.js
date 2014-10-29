var fs = require('fs'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    config = require(path.join(__dirname, 'config', 'config.json'))[env],
    Sequelize = require('sequelize'),
    sequelize = new Sequelize(config.database, config.username, config.password, config),
    models = require('./models');

fs
    .readdirSync('./public/images/courses/')
    .forEach(function(filename) {
        // For each directory in courses

        console.log('filename: ' + filename);

        // Find the current course by code
        models.Course.find({
            where: {
                code: filename
            }
        }).success(function(foundCourse) {
            if (foundCourse === null) {
                createCourse(filename);
            } else {
                console.log("The course " + filename + " already exists.");
                lookupExam(filename, foundCourse);
            }
        });
    });

function createCourse(filename) {
    console.log("The course " + filename + " doesn't exist. Let's create it.");

    models.Course.create({
        code: filename
    }).success(function(newCourse) {
        // With the new course created:
        // public/images/courses/eda040
        console.log(path.join(__dirname, 'public', 'images', 'courses', filename));

        lookupExam(filename, newCourse);
    });
}

function lookupExam(filename, sqlCourse) {
	console.log('lookupProblem(' + filename + ")");
    // For every exam type folder in this course: 
    // public/images/courses/eda040/{exams, solutions}
    fs.readdirSync(path.join(__dirname, 'public', 'images', 'courses', filename))
        .forEach(function(examType) {

            if (examType === 'exams' || examType === 'solutions') {
            	console.log("ExamType:" + examType);
                // For every exam folder in 'exams' or 'solutions'
                // public/images/courses/eda040/{exams,solutions}/<date>
                fs.readdirSync(
                    path.join(__dirname, 'public', 'images', 'courses', filename, examType)
                ).forEach(function(examDate) {
                    console.log("Exam date: " + examDate);

                    // Check if the current exam already exists in the database.
                    models.Exam.find({
                        where: {
                            code: examDate
                        }
                    }).success(function(foundExam) {
                        if (foundExam === null) {
                            console.log("Exam " + path.join(filename, examType, examDate) + " doesn't exist. Let's create it.");
                            if (filename === null || filename === undefined) {
                            	console.log("lookupExam(): null === filename");
                            }
                            if (examType === null || examType === undefined) {
                            	console.log("lookupExam(): null === filename");
                            }
                            if (examDate === null || examDate === undefined) {
                            	console.log("lookupExam(): null === filename");
                            }
                            if (sqlCourse === null || sqlCourse === undefined) {
                            	console.log("lookupExam(): null === filename");
                            }
                            createExam(filename, examType, examDate, sqlCourse);
                        } else {
                            console.log("Exam already exists");
                            // So the current exam exists, but maybe there are new files in this dir? 
                            lookupProblem(filename, examType, examDate, sqlCourse, foundExam);
                        }
                    });
                });
            } else {
                console.log("Please remove: " + path.join(__dirname, 'public', 'images', 'courses', filename, examType));
            }
        });
}

function createExam(filename, examType, examDate, sqlCourse) {
    models.Exam.create({
        code: examDate
    }).success(function(newExam) {
        newExam.setCourse(sqlCourse);
        console.log("Created exam");
        lookupProblem(filename, examType, examDate, sqlCourse, newExam);
    });
}

function lookupProblem(filename, examType, examDate, sqlCourse, sqlExam) {
	console.log('lookupProblem(filename=' + filename + ", examType=" + examType + ", examDate=" + examDate + ")");
    console.log('Adding ' + examDate + ' to ' + sqlCourse);
    var index = 0;

    // For every problem in 
    // public/images/courses/eda040/{exams,solutions}/<date>/<img>
    fs.readdirSync(
        path.join(__dirname, 'public', 'images', 'courses', filename, examType, examDate)
    ).forEach(function(problem) {
        var imgpath = path.join(__dirname, 'public', 'images', 'courses', filename, examType, examDate, problem);
        console.log(imgpath);

        models.Problem.find({
            index: index
        }).success(function(foundProblem) {
            if (foundProblem === null) {
                console.log("Problem " + path.join(filename, examType, examDate, problem) + " didn't exist. Let's create it");
                createProblem(filename, examType, examDate, problem, index, sqlCourse, sqlExam);
            } else {
                console.log("Problem already exists.");
                lookupQuestion(filename, examType, examDate, problem, sqlCourse, sqlExam, foundProblem);
                lookupAnswer(filename, examType, examDate, problem, sqlCourse, sqlExam, foundProblem);
            }

            // Increase the problem index;
        });
        index++;
    });
}

function createProblem(filename, examType, examDate, problem, index, sqlCourse, sqlExam) {
    // Create the problem
    models.Problem.create({
        index: index
    }).success(function(newProblem) {
        // Assign the problem to the current exam
        newProblem.setExam(sqlExam);

        if (examType === 'exams') {
            models.Question.find({
                where: {
                    filename: path.join('images', 'courses', filename, examType, examDate, problem)
                }
            }).success(function(foundQuestion) {
                if (foundQuestion === null) {
                    createQuestion(filename, examType, examDate, problem, sqlCourse, sqlExam, newProblem);
                } else {
                    console.log("Question " + path.join('images', 'courses', filename, examType, examDate, problem) + " already exists.");
                    //foundQuestion.setProblem(newProblem);
                }
            });
        } else if (examType === 'solutions') {
            models.Answer.find({
                where: {
                    filename: path.join('images', 'courses', filename, examType, examDate, problem)
                }
            }).success(function(foundAnswer) {
                if (foundAnswer === null) {
                    createAnswer(filename, examType, examDate, problem, sqlCourse, sqlExam, newProblem);
                } else {
                    console.log("Answer " + path.join('images', 'courses', filename, examType, examDate, problem) + " already exists.");
                    //foundAnswer.setProblem(newProblem);
                }
            });
        }
    });
}

function lookupQuestion(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem) {
	models.Question.find({
		where: {
			filename: path.join('images', 'courses', filename, examType, examDate, problem)
		}
	}).success(function (foundQuestion) {
		if (foundQuestion === null) {
			createQuestion(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem);
		} else {
			console.log("Question " + path.join('images', 'courses', filename, examType, examDate, problem) + " already exists.");
		}
	});
}

function createQuestion(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem) {

    console.log("Question " + path.join('images', 'courses', filename, examType, examDate, problem) + " didn't exist. Let's create it");
    // Create a question
    models.Question.create({
        filename: path.join('images', 'courses', filename, examType, examDate, problem)
    }).success(function(newQuestion) {
        newQuestion.setProblem(sqlProblem);
    });
}

function lookupAnswer(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem) {
	models.Answer.find({
		where: {
			filename: path.join('images', 'courses', filename, examType, examDate, problem)
		}
	}).success(function (foundAnswer) {
		if (foundAnswer === null) {
			createAnswer(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem);
		} else {
			console.log("Answer " + path.join('images', 'courses', filename, examType, examDate, problem) + " already exists.");
		}
	});
}

function createAnswer(filename, examType, examDate, problem, sqlCourse, sqlExam, sqlProblem) {

    console.log("Answer " + path.join('images', 'courses', filename, examType, examDate, problem) + " didn't exist. Let's create it");
    // Create an answer
    models.Answer.create({
        filename: path.join('images', 'courses', filename, examType, examDate, problem)
    }).success(function(newAnswer) {
        newAnswer.setProblem(sqlProblem);
    });
}