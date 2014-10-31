"use strict";

module.exports = {
    up: function(migration, DataTypes, done) {
        migration.dropTable('Tags');
        migration.createTable('Tags', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            },
            title: {
                type: DataTypes.STRING
            },
            slug: {
                type: DataTypes.STRING
            },
            CourseId: {
                type: DataTypes.INTEGER
            },
            ExamId: {
                type: DataTypes.INTEGER
            },
            ProblemId: {
                type: DataTypes.INTEGER
            }
        }).done();
    },

    down: function(migration, DataTypes, done) {
        // add reverting commands here, calling 'done' when finished
        done();
    }
};