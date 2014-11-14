var fs = require('fs'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    config = require(path.join(__dirname, 'config', 'config.json'))[env],
    Sequelize = require('sequelize'),
    sequelize = new Sequelize(config.database, config.username, config.password, config),
    models = require('./models'),
    _ = require('lodash'),
    //minimist = require('minimist')(process.argv.slice(2)),
    program = require('commander');

function main() {

    program
        .version('0.0.1')
        .usage('[options]')
        .option('-h, --help', 'This help menu')
        .option('-d, --dir <course code>', 'Add the course in the ./public/images/courses/<course code> directory', addDirectory, './public/images/courses/')
        .option('-a, --all', 'Add all courses in the ./public/images/courses/<course code> directory. WARNING: Duplicates might occurr.')
        .parse(process.argv);

    if (program.a || program.all) {
        addDirectory(null, './public/images/courses/');
    }
}

function addDirectory(courseCode, directory) {
    console.log('Adding: ' + courseCode);

    fs
        .readdirSync(directory)
        .forEach(function(filename) {
            // For each directory in the provided directory

            if (courseCode && filename != courseCode) {
                return;
            }

            console.log('filename: ' + filename);

            // Find the current course by code
            models.Course.find({
                where: {
                    code: filename
                }
            }).success(function(foundCourse) {
                if (foundCourse === null) {
                    console.log('Course doesn\'t exist: ' + filename);
                    createCourse(filename);
                } 
                // else {
                //     //console.log("The course " + filename + " already exists.");
                //     console.log('Course already exists');
                //     lookupExam(filename, foundCourse);
                // }
            });
        });
}

main();



function createCourse(filename) {
    //console.log("The course " + filename + " doesn't exist. Let's create it.");

    models.Course.create({
        code: filename
    }).success(function(newCourse) {
        // With the new course created:
        // public/images/courses/eda040
        //console.log(path.join(__dirname, 'public', 'images', 'courses', filename));

        lookupExam(filename, newCourse);
    });
}

function lookupExam(filename, sqlCourse) {
    //console.log('lookupProblem(' + filename + ")");
    // For every exam type folder in this course: 
    // public/images/courses/eda040/{exams, solutions}
    var folders = fs.readdirSync(path.join(__dirname, 'public', 'images', 'courses', filename));
    var filteredFolders = _.filter(folders, function(x) {
        return x === 'exams' || x === 'solutions';
    });

    if (filteredFolders.length === 2) {
        //if (examType === 'exams' || examType === 'solutions') {
        // For every exam folder in 'exams' or 'solutions'
        // public/images/courses/eda040/{exams,solutions}/<date>

        var examFolders = fs.readdirSync(path.join(__dirname, 'public', 'images', 'courses', filename, 'exams'));
        var solutionFolders = fs.readdirSync(path.join(__dirname, 'public', 'images', 'courses', filename, 'solutions'));

        // Find exams with solutions:
        var examsWithSolutions = _.intersection(examFolders, solutionFolders);

        examFolders.forEach(function(examDate) {
            models.Exam.find({
                where: {
                    code: examDate
                }
            }).success(function(foundExam) {
                var examType = _.contains(solutionFolders, examDate) ? ['exams', 'solutions'] : ['exams'];

                if (foundExam === null) {
                    console.log('Exam wans\'t found: ' + examDate);
                    createExam(filename, examType, examDate, sqlCourse);
                } 
                // else {
                //     console.log('Exam was found: ' + filename);
                //     lookupProblem(filename, examType, examDate, sqlCourse, foundExam);
                // }
            });
        });
    } else {
        console.log('Missing \'exams\' or \'solutions\' folders. Exiting.');
    }
}

function createExam(filename, examType, examDate, sqlCourse) {
    models.Exam.create({
        code: examDate
    }).success(function(newExam) {
        newExam.setCourse(sqlCourse);
        //console.log("Created exam");
        lookupProblem(filename, examType, examDate, sqlCourse, newExam);
    });
}

function lookupProblem(filename, examType, examDate, sqlCourse, sqlExam) {
    //console.log('lookupProblem(filename=' + filename + ", examType=" + examType + ", examDate=" + examDate + ")");
    //console.log('Adding ' + examDate + ' to ' + sqlCourse);
    var index = 0;

    // For every problem in 
    // public/images/courses/eda040/{exams,solutions}/<date>/
    // which will give 
    // public/images/courses/eda040/{exams,solutions}/<date>/<img>
    fs.readdirSync(
        path.join(__dirname, 'public', 'images', 'courses', filename, 'exams', examDate)
    ).forEach(function(img) {
        var imgpath = path.join(__dirname, 'public', 'images', 'courses', filename, 'exams', examDate, img);
        createProblem(filename, examType, examDate, img, index, sqlCourse, sqlExam);
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

        // There will always be an exam question.
        models.Question.find({
            where: {
                filename: path.join('images', 'courses', filename, 'exams', examDate, problem)
            }
        }).success(function(foundQuestion) {
            console.log('####################################################################')
            if (foundQuestion === null) {
                createQuestion(filename, 'exams', examDate, problem, sqlCourse, sqlExam, newProblem);
            } else {
                //console.log("Question " + path.join('images', 'courses', filename, 'exams', examDate, problem) + " already exists.");
                //foundQuestion.setProblem(newProblem);
            }
        });

        // Check if we have a solution.
        if (_.contains(examType, 'solutions')) {
            models.Answer.find({
                where: {
                    filename: path.join('images', 'courses', filename, 'solutions', examDate, problem)
                }
            }).success(function(foundAnswer) {
                if (foundAnswer === null) {
                    createAnswer(filename, 'solutions', examDate, problem, sqlCourse, sqlExam, newProblem);
                } else {
                    console.log("Answer " + path.join('images', 'courses', filename, 'solutions', examDate, problem) + " already exists.");
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
    }).success(function(foundQuestion) {
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
    console.log("Answer " + path.join('images', 'courses', filename, examType, examDate, problem) + " didn't exist. Let's create it");
    models.Answer.find({
        where: {
            filename: path.join('images', 'courses', filename, examType, examDate, problem)
        }
    }).success(function(foundAnswer) {
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