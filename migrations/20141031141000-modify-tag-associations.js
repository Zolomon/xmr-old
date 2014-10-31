"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.addColumn('Tags', 'CourseId', DataTypes.INTEGER).done(done);
  	migration.addColumn('Tags', 'ExamId', DataTypes.INTEGER).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('Tags', 'CourseId').done(done);
    migration.removeColumn('Tags', 'ExamId').done(done);
  }
}
