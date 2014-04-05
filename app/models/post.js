var Post = function () {

  this.defineProperties({
	  content: {type: 'text', required:true},
	  timestamp: {type: 'datetime', required: true},
	  // locationDescription: {type: 'string'},
	  // locationLat: {type: 'number'},
	  // locationLong: {type: 'number'},
	  author: {type: 'object', required: true}
	  // comments: {type: 'object'}
	  
	  // is the post natively created or pulled in from FB/Tw?
	  // nativePost: {type: 'boolean', required: true}
  });

  this.belongsTo('Event');
  
  // this.belongsTo('User');
  this.hasMany('Comments');
};

exports.Post = Post;
