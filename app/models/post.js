
var Post = function () {

  this.defineProperties({
	  contents: {type: 'text', required:true},
	  timestamp: {type: 'datetime', required: true},
	  // locationDescription: {type: 'string'},
	  // locationLat: {type: 'number'},
	  // locationLong: {type: 'number'},
	  // querying by posting user will also be important
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
