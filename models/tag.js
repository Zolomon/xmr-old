(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var Tag = sequelize.define("Tag", {
            title: DataTypes.STRING,
            slug: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Tag.belongsTo(models.Problem);
                    Tag.belongsTo(models.Exam);
                    Tag.belongsTo(models.Course);
                }
            }
        });

        return Tag;
    };
}());