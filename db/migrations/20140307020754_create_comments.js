var CreateComments = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('postingUser', 'object');
          t.column('timestamp', 'datetime');
          t.column('message', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('comment', def, callback);
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
    this.dropTable('comment', callback);
  };
};

exports.CreateComments = CreateComments;
