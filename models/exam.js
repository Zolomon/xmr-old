(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Exam = sequelize.define("Exam", {
            title: DataTypes.STRING,
            code: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Exam.belongsTo(models.Course);
                    Exam.hasMany(models.Problem);
                    Exam.hasMany(models.Tag);
                }
            }
        });

        return Exam;
    };
}());