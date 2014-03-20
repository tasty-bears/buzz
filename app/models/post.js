
var Post = function () {

  this.defineProperties({
  // we will want to query for posts primarily by their datetime
    timestamp: {type: 'datetime', required: true},
    locationDescription: {type: 'string'},
    locationLat: {type: 'number'},
    locationLong: {type: 'number'},
    // querying by posting user will also be important
    author: {type: 'object', required: true},
    comments: {type: 'object'}
//    // is the post natively created in Buzz, or pulled in from Twitter/Facebook?
//    nativePost: {type: 'boolean', required: true}
  });

  this.belongsTo('Event');
  
  // this.belongsTo('User');
  this.hasMany('Comments');
};

exports.Post = Post;
