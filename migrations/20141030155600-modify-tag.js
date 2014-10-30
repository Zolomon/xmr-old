"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Tags', 'slug', DataTypes.STRING).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('Tags', 'slug').done(done);
  }
}
