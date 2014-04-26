var Post = function () {

  this.defineProperties({
	  content: {type: 'text', required:true},
	  timestamp: {type: 'datetime', required: true},
	  // locationDescription: {type: 'string'},
	  // locationLat: {type: 'number'},
	  // locationLong: {type: 'number'},
	  author: {type: 'object', required: true},
	  media: {type: 'object'},
	  // comments: {type: 'object'}
  });

  this.belongsTo('Event');

  // TODO: change to hasMany
  this.hasOne('Media');

  // TODO: this.belongsTo('User');

  this.hasMany('Comments');
};

exports.Post = Post;
