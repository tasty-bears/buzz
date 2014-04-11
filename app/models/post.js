var Post = function () {

  this.defineProperties({
	  content: {type: 'text', required:true},
	  timestamp: {type: 'datetime', required: true},
	  // locationDescription: {type: 'string'},
	  // locationLat: {type: 'number'},
	  // locationLong: {type: 'number'},
	  author: {type: 'object', required: true},
	  media: {type: 'object'},
	  // TODO refactor; link to media should not belong to
	  // a post
	  medialink: {type: 'string'}
	  // comments: {type: 'object'}
  });

  this.belongsTo('Event');
  // TODO
  // this.hasOne('Media');
  // TODO
  // this.belongsTo('User');
  this.hasMany('Comments');
};

exports.Post = Post;
