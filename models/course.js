(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Course = sequelize.define("Course", {
            name: DataTypes.STRING,
            code: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Course.hasMany(models.Exam);
                    Course.hasMany(models.Tag);
                }
            }
        });

        return Course;
    };
}());