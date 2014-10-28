(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Question = sequelize.define("Question", {
            filename: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Question.belongsTo(models.Problem);
                }
            }
        });

        return Question;
    };
}());