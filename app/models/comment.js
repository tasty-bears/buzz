var Comment = function () {

  this.defineProperties({
    author: {type: 'object', required: true},
    timestamp: {type: 'datetime', required: true},
    content: {type: 'string', required: true}
  });

  this.belongsTo('Post');

//  //? is this correct
//  this.validatesPresent('postingUser');
};

exports.Comment = Comment;
