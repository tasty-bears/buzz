var Comment = function () {

  this.defineProperties({
    postingUser: {type: 'object', required: true},
    timestamp: {type: 'datetime', required: true},
    message: {type: 'string', required: true}
  });

  this.belongsTo('Post');

  //? is this correct
  this.validatesPresent('postingUser');

  // TODO
  // this.createComment = function() {

  // }

exports.Comment = Comment;
//? TODO register