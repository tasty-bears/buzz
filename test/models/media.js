var assert = require('assert')
  , tests
  , Media = geddy.model.Media;

tests = {

  'after': function (next) {
    // cleanup DB
    Media.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var media = Media.create({});
    media.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
