(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Answer = sequelize.define("Answer", {
            filename: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Answer.belongsTo(models.Problem);
                }
            }
        });

        return Answer;
    };
}());