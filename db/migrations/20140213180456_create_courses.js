var CreateCourses = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('courseNumber', 'int');
          t.column('section', 'int');
          t.column('professor', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('course', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('course', callback);
  };
};

exports.CreateCourses = CreateCourses;
