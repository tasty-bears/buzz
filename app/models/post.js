var Post = function () {

  this.defineProperties({
	  content: {type: 'text', required:true},
	  timestamp: {type: 'datetime', required: true},
	  // locationDescription: {type: 'string'},
	  // locationLat: {type: 'number'},
	  // locationLong: {type: 'number'},
	  author: {type: 'object', required: true}
	  // comments: {type: 'object'}
  });

  this.belongsTo('Event');
  this.hasOne('Media');
  // this.belongsTo('User');
  this.hasMany('Comments');
};

exports.Post = Post;
