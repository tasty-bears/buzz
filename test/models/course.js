var assert = require('assert')
  , tests
  , Course = geddy.model.Course;

tests = {

  'after': function (next) {
    // cleanup DB
    Course.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var course = Course.create({});
    course.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
