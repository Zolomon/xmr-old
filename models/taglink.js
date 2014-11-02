(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {
        var TagLink = sequelize.define("TagLink", {
            title: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    TagLink.belongsTo(models.Problem);
                    TagLink.belongsTo(models.Tag);
                }
            }
        });

        return TagLink;
    };
}());