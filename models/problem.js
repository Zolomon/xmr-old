(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Problem = sequelize.define("Problem", {
            index: DataTypes.INTEGER
        }, {
            classMethods: {
                associate: function(models) {
                    Problem.belongsTo(models.Exam);
                    Problem.hasOne(models.Question);
                    Problem.hasOne(models.Answer);
                    Problem.hasMany(models.Tag);
                }
            }
        });

        return Problem;
    };
}());