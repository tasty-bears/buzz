var CreatePosts = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('timestamp', 'datetime');
          t.column('locationDescription', 'string');
          t.column('locationLat', 'number');
          t.column('locationLong', 'number');
          t.column('postingUser', 'object');
          t.column('course', 'object');
          t.column('public', 'boolean');
          t.column('comments', 'object');
          t.column('nativePost', 'boolean');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('post', def, callback);
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
    this.dropTable('post', callback);
  };
};

exports.CreatePosts = CreatePosts;
